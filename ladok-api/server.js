const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3003;

const axios = require('axios');
// Ladda MySQL-biblioteket.
const mysql = require('mysql');

// Skapa en connection med vår DigitalOcean-host och användarnamn, lösenord, 
// och epok-databasen.
const connection = mysql.createConnection({
  host: '178.62.11.13',
  user: 'test',
  password: 'testpass',
  database: 'epok'
});
// Connecta till databasen.
connection.connect();

connection.query('drop table Grade;');
connection.query(`
create table if not exists Grade(
  id int auto_increment primary key,
  personId varchar(64) not null,
  examId varchar(64) not null,
  course varchar(64) not null,
  grade varchar(64) not null
);`)

function insert(personId, examId, course, grade) {
  connection.query(`
insert into Grade (personId, examId, course, grade) 
  values ('${personId}', '${examId}', '${course}', '${grade}');`);
}

// insert('Mattias', 'Tenta', 'Java 2', 'VG');


// Läs in request-body med URL-enkodning.
app.use(express.urlencoded());
// Läs in request-body som JSON.
app.use(bodyParser.json());

app.get('/', (req, res) => res.send("Hello, world! This is Martin"));

app.get('/grades', (req, res) => {
  const query = `
select * from Grade;`;
  connection.query(query, (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  })
});

app.get('/grade', (req, res) => {
  const { personId, examId, course } = req.query;
  const query = `
select * from Grade where personId = '${personId}' 
  and examId = '${examId}'
  and course = '${course}';`;
  console.log(query);
  connection.query(query,
    (error, results, fields) => {
      if (error) throw error;
      res.json(results);
    });
});

/*
{
  "grade": "A",
  "personId": "770101-0101",
  "course": "LTU-12345",
  "examId": "???"
}
*/
app.post('/grade', (req, res) => {
  const { grade, personId, course, examId } = req.body;
  insert(personId, examId, course, grade);
  res.send({ success: true });
});

app.listen(port, () => {
  console.log(`Listening on ${port}.`);

  axios.post(`http://localhost:${port}/grade`,
    {
      grade: 'VG',
      personId: 'Mattias',
      course: 'Java 2',
      examId: 'Tenta'
    })
    .catch(err => {
      throw err;
    })
    .then(res => axios.get(`http://localhost:${port}/grades`))
    .then(res => console.log(res.data));
});
