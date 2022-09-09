const express = require('express');
const { slackReceiver } = require('./slack');

const app = express();
const port = 3000;

app.use(slackReceiver.router);

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});