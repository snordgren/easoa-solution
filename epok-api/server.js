// Ladda Express-biblioteket. Express använder vi för att skapa vår HTTP-server.
const express = require('express');
const bodyParser = require('body-parser');
// Ladda Axios som vi använder när vi kör requests mot andra HTTP-servers. 
const axios = require('axios');

// Starta vår express-app. 
const app = express();

// Porten vi ska köra den här servern på. 
const port = 3001;

// Ladda MySQL-biblioteket.
var mysql = require('mysql');

// Skapa en connection med vår DigitalOcean-host och användarnamn, lösenord, 
// och epok-databasen.
var connection = mysql.createConnection({
  host: '178.62.11.13',
  user: 'test',
  password: 'testpass',
  database: 'epok'
});
// Connecta.
connection.connect();

// Kör en query för att se till att databasen fungerar. Utgå från detta när vi gör 
// fler grejer med databasen.
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {

  // Rapportera vidare om det blir en error.
  if (error) throw error;

  // Printa lösningen på vår query.
  console.log('The solution is: ', results[0].solution);
});

// Läs in HTTP-input som JSON.
app.use(bodyParser.json());

// Skapa en HTTP GET på http://localhost:3001/course. 
// HTTP-routen hämtar en anmälningskod baserat på Ideal, Kurskod och Termin.
app.get('/course', (req, res) => {

  // Ta ut variablerna "course" och "semester" från URL:en på routen.
  const { course, semester } = req.query;
  res.json({ code: 'LTU-37012' })
});

// Körs när servern har startar.
app.listen(port, () => {
  console.log(`Listening on ${port}.`);

  // Skicka ett request till course för att se till att routen fungerar.
  axios
    .get('http://localhost:3001/course', { params: {
      semester: '3',
      course: 'D0023E'
    }})
    .then(res => { console.log(res.data); }); // När vi har kört vårt request, printa resultatet.
});
