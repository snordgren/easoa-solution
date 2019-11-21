const express = require('express');
const app = express();
const port = 3004;

const axios = require('axios');

// Läs in request-body med URL-enkodning.
app.use(express.urlencoded());
app.use(express.json());

app.set('view engine', 'pug');
app.get('/', (req, res) => {
  const grades = axios.get('http://localhost:3003/grades').then(res => res.data).then(data => {
    console.log(data);
    res.render('index', {
      title: 'Teacher UI',
      message: 'Teacher UI',
      grades: data
    });
  });
});
app.post('/grade', (req, res) => {
  const { grade, personId, course, examId } = req.body;
  const grades = axios.put('http://localhost:3003/grade', { grade, personId, course, examId })
    .catch(err => res.send(400, err))
    .then(_res => {
      res.redirect('/');
    });
});
app.post('/new-grade', (req, res) => {
  const { idealId, courseId, semester, examId, date, grade } = req.body;
  // Find course from idealId, course, semester in Epok.
  let occasionId;
  axios.get('http://localhost:3001/occasion', { params: { courseId, semester } })
    .catch(err => { throw err; })
    .then(res => {
      // Based on idealId and occasion, get the 
      occasionId = res.data[0].id;
      console.log(occasionId);
      if (!occasionId) {
        throw 'Undefined ID.'
      }
      return axios.get('http://localhost:3002/student', { params: { idealId, occasionId: occasionId }})
    })
    .catch(err => { throw err; })
    .then(res => {
      console.log(res.data);
      const { personId } = res.data[0];
      return axios.post('http://localhost:3003/grade', {
        personId,
        occasionId,
        examId,
        date,
        grade
      });
    })
    .catch(err => { throw err; })
    .then(_res => {
      res.redirect('/');
    })
});
app.listen(port, () => console.log(`Listening on ${port}.`))
