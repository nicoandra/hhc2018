const express = require('express');
const app = express();
const multiparty = require('multiparty');

app.post('/', (req, res) => {
  res.send('Hi PowerShell!');

  console.log(req.query);

  req.query.data ? console.log(req.query.data) : '';

})

app.listen(8084, function(err){
  console.log("Failed?", err)
});
