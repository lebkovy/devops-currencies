const express = require("express");

const app = express();

app.get('/hello', (req, res) => {
    res.send('Hello world from express server');
});

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
});