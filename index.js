require('dotenv').config();

const express = require('express');
const {exec} = require('child_process');
var waitOn = require('wait-on');

const app = express();

const port = process.env.SERVER_PORT ? process.env.SERVER_PORT : 1000;


const wait = (timeout) => {
  const opts = {
    resources: [
      `http://localhost:${process.env.UI_PORT}`,
    ],
    delay: 2000, // initial delay in ms, default 0
    interval: 100, // poll interval in ms, default 250ms
    simultaneous: 1, // limit to 1 connection per resource at a time
    timeout: timeout? timeout : 3000, // timeout in ms, default Infinity
    tcpTimeout: 1000, // tcp timeout in ms, default 300ms
    window: 1000, // stabilization time in ms, default 750ms
  };

  return new Promise((resolve) => {
    waitOn(opts)
    .then(function () {
      resolve(true);
    })
    .catch(function () {
      resolve(false);
    });
  });
};

app.post('/start', async (req, res) => {
  const test = await wait(3000);

  if(test) {
    res.send({status: 'running'});
  } else {
    exec(`bash start.sh`);

    const result = await wait(20000);
  
    if(result) {
      res.send({status: 'success'});
    } else {
      res.send({status: 'error'});
    }
  }
});

app.post('/stop', async (req, res) => {
  exec(`bash stop.sh`);

  const result = await wait(3000);

  if(!result) {
    res.send({status: 'success'});
  } else {
    res.send({status: 'error'});
  }
});

app.listen(port, () => console.log(`Firebase launcher is listening on port ${port}.`));