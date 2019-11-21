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

connection.query('drop table if exists Grade;');
connection.query(`
create table if not exists Grade(
  id int auto_increment primary key,
  personId varchar(64) not null,
  examId varchar(64) not null,
  occasionId varchar(64) not null,
  date varchar(64) not null,
  grade varchar(64) not null
);`)

function insert(personId, examId, occasionId, date, grade) {
  connection.query(`
insert into Grade (personId, examId, occasionId, date, grade) 
  values ('${personId}', '${examId}', '${occasionId}', '${date}', '${grade}');`);
}

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
  const { personId, examId, occasionId } = req.query;
  const query = `
select * from Grade where personId = '${personId}' 
  and examId = '${examId}'
  and occasionId = '${occasionId}';`;

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
  const { grade, personId, occasionId, examId, date } = req.body;
  insert(personId, examId, occasionId, date, grade);
  res.json({ success: true });
});

app.put('/grade', (req, res) => {
  const { grade, personId, occasionId, examId, date } = req.body;
  function update(personId, examId, occasionId, grade, date) {
    connection.query(`
update Grade set grade = '${grade}', date = '${date}'
  where personId = '${personId}' and examId = '${examId}' and course = '${course}';`);
  }
  update(personId, examId, course, grade);
  res.json({ success: true });
})

app.listen(port, () => {
  console.log(`Listening on ${port}.`);

  axios.post(`http://localhost:${port}/grade`,
    {
      grade: 'VG',
      personId: '990815-8372',
      occasionId: '37000',
      examId: '0001',
      date: '2019-11-21'
    })
    .catch(err => {
      throw err;
    })
    .then(res => axios.get(`http://localhost:${port}/grades`))
    .then(res => console.log(res.data));
});
