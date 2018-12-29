const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://mongo:27017';

// Database Name
const dbName = 'myproject';

// Create a new MongoClient 
const client = new MongoClient(url);

// Use connect method to connect to the Server
client.connect(function(err) {
  console.log(err, "Connected successfully to server");
  const db = client.db(dbName);
});


module.export = client;
