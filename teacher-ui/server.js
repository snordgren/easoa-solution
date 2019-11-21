const express = require('express');
const app = express();
const port = 3004;

const axios = require('axios');

// Läs in request-body med URL-enkodning.
app.use(express.urlencoded());

app.set('view engine', 'pug');
app.get('/', (req, res) => {
  const grades = axios.get('http://localhost:3003/grades').then(res => res.data).then(data => {
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
app.listen(port, () => console.log(`Listening on ${port}.`))
