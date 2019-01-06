#!/usr/bin/node
//pcapalyzer - The web based packet analyzer
const cluster = require('cluster');
const os = require('os');
const path = require('path');
const fs = require('fs');
const http2 = require('http2');
const koa = require('koa');
const Router = require('koa-router');
const mime = require('mime-types');
const mongoose = require('mongoose');
const koaBody = require('koa-body');
const cookie = require('koa-cookie');
const execSync = require('child_process').execSync;
const execAsync = require('child_process').exec;
const redis = require("redis");
const redis_connection = redis.createClient();
const {promisify} = require('util');
const getAsync = promisify(redis_connection.get).bind(redis_connection);
const setAsync = promisify(redis_connection.set).bind(redis_connection);
const delAsync = promisify(redis_connection.del).bind(redis_connection);
const sha1 = require('sha1');
require('events').EventEmitter.defaultMaxListeners = Infinity;
const log = console.log;
const print = log;
const dev_mode = true;


const key_log_path = ( !dev_mode || __dirname + process.env.DEV + process.env.SSLKEYLOGFILE )
const options = {
  key: fs.readFileSync(__dirname + '/keys/server.key'),
  cert: fs.readFileSync(__dirname + '/keys/server.crt'),
  http2: {
    protocol: 'h2',         // HTTP2 only. NOT HTTP1 or HTTP1.1
    protocols: [ 'h2' ],
  },
  keylog : key_log_path     //used for dev mode to view traffic. Stores a few minutes worth at a time
};

//==================================
//Standard Mongoose Connection Stuff
//==================================
const app = new koa();
const router = new Router();
router.use(cookie.default());
app.use(router.routes()).use(router.allowedMethods());
mongoose.connect('mongodb://localhost:27017/packalyzer',{ useNewUrlParser: true });
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  is_admin: { type: Boolean, required: true },
  captures: { type: Array, required: true },
});
const Users = mongoose.model('Users', userSchema);
//Sets Users to be allowed to sniff or just admins
const Allow_All_To_Sniff = true;

//==================================
//Standard Mongoose Connection Stuff
//==================================

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
      if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
      }
  }
  return this;
};
var uniqueArray = function(arrArg) {
  return arrArg.filter(function(elem, pos,arr) {
    return arr.indexOf(elem) == pos;
  });
};

function load_envs() {
  var dirs = []
  var env_keys = Object.keys(process.env)
  for (var i=0; i < env_keys.length; i++) {
    if (typeof process.env[env_keys[i]] === "string" ) {
      dirs.push(( "/"+env_keys[i].toLowerCase()+'/*') )
    }
  }
  return uniqueArray(dirs)
}
if (dev_mode) {
    //Can set env variable to open up directories during dev
    const env_dirs = load_envs();
} else {
    const env_dirs = ['/pub/','/uploads/'];
}

const api_functions = {
    'login':login,
    'logout':logout,
    'users':find_users,
    'register':register,
    'upload':upload,
    'list':list_caps,
    'delete':delete_caps,
    'sniff':sniff_traffic,
    'process':start_process,
  }
  const api_function = async (ctx, next) => {
    var Session = await sessionizer(ctx);
    const action = ctx.params.action;
    if ((Session.authenticated && Object.keys(api_functions).includes(action)) || ['login','register','users'].includes(action) ) {
      if (typeof api_functions[action] === 'function') {
        try{
          await api_functions[action](ctx, next, Session);
        } catch (e) {
          log(e)
          ctx.status=500;
          ctx.body=e.toString();
        }
      } else {
        ctx.body='Not Found';
      }
    } else {
      ctx.status=401;
      ctx.body='Unauthorized';
    }
    await next();
  }

  //Route for anything in the public folder except index, home and register
router.get(env_dirs,  async (ctx, next) => {
try {
    var Session = await sessionizer(ctx);
    //Splits into an array delimited by /
    let split_path = ctx.path.split('/').clean("");
    //Grabs directory which should be first element in array
    let dir = split_path[0].toUpperCase();
    split_path.shift();
    let filename = "/"+split_path.join('/');
    while (filename.indexOf('..') > -1) {
    filename = filename.replace(/\.\./g,'');
    }
    if (!['index.html','home.html','register.html'].includes(filename)) {
    ctx.set('Content-Type',mime.lookup(__dirname+(process.env[dir] || '/pub/')+filename))
    ctx.body = fs.readFileSync(__dirname+(process.env[dir] || '/pub/')+filename)
    } else {
    ctx.status=404;
    ctx.body='Not Found';
    }
} catch (e) {
    ctx.body=e.toString();
}
});

router
.get('/api/:action', async (ctx, next) => {
await api_function(ctx, next)
})
.post('/api/:action', koaBody({ multipart: true }), async (ctx, next) => {
await api_function(ctx, next)
})

const server = http2.createSecureServer(options, app.callback());
server.listen(443);
