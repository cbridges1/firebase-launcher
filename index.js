const express = require('express');
const {exec} = require('child_process');

const app = express();

const port = process.env.SERVER_PORT ? process.env.SERVER_PORT : 1000;

var newProc = '';

app.post('/start', (req, res) => {
  exec(`bash start.sh`);
  res.send({});
});

app.post('/stop', async (req, res) => {
  exec(`bash stop.sh ${newProc.pid}`);
  newProc = '';
  res.send({});
});

app.listen(port, () => console.log(`Firebase launcher is listening on port ${port}.`));