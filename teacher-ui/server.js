const express = require('express');
const app = express();
const port = 3004;

app.set('view engine', 'pug');
app.get('/', (req, res) => res.render('index', {
  title: 'hey',
  message: 'Hello there',
  grades: [
    { name: 'A', grade: 'VG' }, 
    { name: 'B', grade: 'MVG' }
  ]
}));
app.listen(port, () => console.log(`Listening on ${port}.`))
