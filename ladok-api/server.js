const express = require('express');
const app = express();
const port = 3003;

app.get('/', (req, res) => res.send("Hello, world! This is Martin"));
app.listen(port, () => console.log(`Listening on ${port}.`))
