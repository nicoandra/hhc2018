#!/usr/bin/node
//pcapalyzer - The web based packet analyzer
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


// This path contains the logs key to decrypt SSL traffic in WireShark
const key_log_path = __dirname + process.env.DEV + process.env.SSLKEYLOGFILE;

const options = {
  key: fs.readFileSync(__dirname + '/keys/server.key'),
  cert: fs.readFileSync(__dirname + '/keys/server.crt'),
  http2: {
    protocol: 'h2',         // HTTP2 only. NOT HTTP1 or HTTP1.1
    protocols: [ 'h2' ],
  },
  keylog : key_log_path     //used for dev mode to view traffic. Stores a few minutes worth at a time
};

function load_envs() {
  var dirs = []
  var env_keys = Object.keys(process.env)


  for (var i=0; i < env_keys.length; i++) {
    if (typeof process.env[env_keys[i]] === "string" ) {
      dirs.push(( "/"+env_keys[i].toLowerCase()+'/*') )
    }
  }
  // dirs = [ /process.env.DEV/ ,  /process.env.SSLKEYLOGFILE/ ]
  return uniqueArray(dirs)
}

//Can set env variable to open up directories during dev
const env_dirs = load_envs();

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
    //Splits into an array delimited by / and remove spaces
    let split_path = ctx.path.split('/').clean("");
    //Grabs directory which should be first element in array
    let dir = split_path[0].toUpperCase();

    // dirs = [ /process.env.DEV/ ,  /process.env.SSLKEYLOGFILE/ ]

    // dir = ( first part of url )
    split_path.shift();
    let filename = "/"+split_path.join('/');
    while (filename.indexOf('..') > -1) {
        // remove .. , to avoid path traversal.
        filename = filename.replace(/\.\./g,'');
    }
    if (!['index.html','home.html','register.html'].includes(filename)) {

        // Need to trigger this function

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
