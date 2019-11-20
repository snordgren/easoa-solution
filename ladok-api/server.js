const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3003;

const axios = require('axios');

app.use(bodyParser.json());
app.get('/', (req, res) => res.send("Hello, world! This is Martin"));

/*
{
  "grade": "A",
  "personId": "770101-0101",
  "course": "LTU-12345",
  "examId": "???"
}
*/
app.post('/grade', (req, res) => {
  const grade = req.body.grade;
  const personId = req.body.personId;
  const course = req.body.course;
  const examId = req.body.examId;

  res.json(req.body);
});

app.listen(port, () => {
  console.log(`Listening on ${port}.`);

  axios.post(`http://localhost:${port}/grade`, {
    grade: '1',
    personId: '2',
    course: '3',
    examId: '4'
  }).then(res => console.log(res.data));
});
