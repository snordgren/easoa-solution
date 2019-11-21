const express = require('express');
const app = express();
const port = 3004;

const axios = require('axios');

app.set('view engine', 'pug');
app.get('/', (req, res) => {
  const grades = axios.get('http://localhost:3003/grades').then(res => res.data).then(data => {
    res.render('index', {
      title: 'Tecaher UI',
      message: 'Teacher UI',
      grades: data
    });
  });
});
app.listen(port, () => console.log(`Listening on ${port}.`))
