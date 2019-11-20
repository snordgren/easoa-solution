const express = require('express');
const app = express();
const port = 3002;

app.get('/', (req, res) => res.send("Hello, world!"));
app.listen(port, () => console.log(`Listening on ${port}.`))
