// Ladda Express-biblioteket. Express använder vi för att skapa vår HTTP-server.
// I JavaScript är bibliotek variabler som alla andra.
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
// Connecta till databasen.
connection.connect();
connection.query('drop table if exists CourseOccasion;');
connection.query(`
create table if not exists CourseOccasion(
  id int auto_increment primary key,
  courseId varchar(64) not null,
  semester varchar(64) not null
);`);

// Läs in HTTP-input som JSON.
app.use(bodyParser.json());

// Skapa en HTTP GET på http://localhost:3001/course. 
// HTTP-routen hämtar en anmälningskod baserat på Ideal, Kurskod och Termin.
app.get('/occasion', (req, res) => {
  // Ta ut variablerna "course" och "semester" från URL:en på routen.
  const { courseId, semester } = req.query;

  let query;
  if (courseId && semester) {
    query = `
      select * from CourseOccasion where courseId = '${courseId}' 
        and semester = '${semester}';`;
  } else {
    query = 'select * from CourseOccasion';
  }

  connection.query(query, (error, results, fields) => {
    if (error) throw error;
    if (!results) throw 'Results are undefined.';
    console.log(`GET courseId=${courseId}, semester=${semester}, results=${JSON.stringify(results)}`);
    res.json(results);
  });
});

app.post('/occasion', (req, res) => {
  const { courseId, semester } = req.body;
  connection.query(`
insert into CourseOccasion (courseId, semester) values ('${courseId}', '${semester}');`,
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
    .post('http://localhost:3001/occasion', {
      courseId: 'D0031N',
      semester: 'ht19'
    })
    .catch(err => {
      throw err;
    })
    .then(res => axios
      .get('http://localhost:3001/occasion', {
        params: {
          semester: 'ht19',
          courseId: 'D0031N'
        }
      }))
    .catch(err => {
      throw err;
    })
    .then(res => console.log(res.data)); // Efter vårt request, printa resultatet.
});
