// Ladda Express-biblioteket. Express använder vi för att skapa vår HTTP-server.
// I JavaScript är bibliotek variabler som alla andra.
const express = require('express');
const bodyParser = require('body-parser');
// Ladda Axios som vi använder när vi kör requests mot andra HTTP-servers. 
const axios = require('axios');

// Starta vår express-app. 
const app = express();

// Porten vi ska köra den här servern på. 
const port = 3002;

// Ladda MySQL-biblioteket.
var mysql = require('mysql');

// Skapa en connection med vår DigitalOcean-host och användarnamn, lösenord, 
// och epok-databasen.
var connection = mysql.createConnection({
  host: '178.62.11.13',
  user: 'test',
  password: 'testpass',
  database: 'ideal'
});
// Connecta till databasen.
connection.connect();
connection.query('drop table if exists Student;');
connection.query(`
create table if not exists Student(
  id int auto_increment primary key,
  personId varchar(64) not null,
  idealId varchar(64) not null,
  occasionId varchar(64) not null
);`);

// Läs in HTTP-input som JSON.
app.use(bodyParser.json());

// Skapa en HTTP GET på http://localhost:3001/course. 
// HTTP-routen hämtar en anmälningskod baserat på Ideal, Kurskod och Termin.
app.get('/student', (req, res) => {
  // Ta ut variablerna "course" och "semester" från URL:en på routen.
  const { idealId, occasionId } = req.query;

  let query;
  if (idealId && occasionId) {
    query = `
      select * from Student where occasionId = '${occasionId}' 
        and idealId = '${idealId}';`;
  } else {
    query = 'select * from Student';
    console.log(idealId + ',' + occasionId);
  }

  connection.query(query, (error, results, fields) => {
    if (error) throw error;
    console.log(`GET idealId=${idealId}, occasionId=${occasionId}, results=${JSON.stringify(results)}`)
    res.json(results);
  });
});

app.post('/student', (req, res) => {
  const { idealId, occasionId, personId } = req.body;
  connection.query(`
insert into Student (idealId, occasionId, personId) 
  values ('${idealId}', '${occasionId}', '${personId}');`,
    (err, results, fields) => {
      if (err) {
        res.send(err);
        throw err;
      }
      res.json({ success: true });
    });
});

// Körs när servern har startar.
app.listen(port, () => {
  axios
    .post('http://localhost:3002/student', {
      idealId: 'silnor-7',
      occasionId: '37000',
      personId: '990815-8372'
    })
    .post('http://localhost:3002/student', {
      idealId: 'nornic-7',
      occasionId: '37000',
      personId: '930817-7436'
    })
    .post('http://localhost:3002/student', {
      idealId: 'marmod-7',
      occasionId: '37000',
      personId: '961119-2031'
    })
    .catch(err => {
      throw err;
    })
    .then(res => axios
      .get('http://localhost:3002/student', {
        params: {
          idealId: 'silnor-7',
          occasionId: '1',
          personId: '990815-8372'
        }
      }))
    .catch(err => {
      throw err;
    })
    .then(res => console.log(res.data)); // Efter vårt request, printa resultatet.
});
