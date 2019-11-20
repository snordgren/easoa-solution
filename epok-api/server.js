const express = require('express');
const app = express();
const port = 3001;

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: '178.62.11.13',
  user: 'test',
  password: 'testpass',
  database: 'epok'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});

connection.end();

app.get('/', (req, res) => res.send("Hello, world!"));
app.listen(port, () => console.log(`Listening on ${port}.`))
