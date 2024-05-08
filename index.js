require('dotenv').config();
const fs = require('fs');

const express = require('express');
const {exec} = require('child_process');
var waitOn = require('wait-on');

const app = express();

const port = process.env.SERVER_PORT ? process.env.SERVER_PORT : 1000;

let delay = 2000;
let timeout = 3000;

const uiUrl = `http://localhost:${process.env.UI_PORT}`;

const wait = () => {
  const opts = {
    resources: [
      uiUrl,
    ],
    delay: delay, // initial delay in ms, default 0
    interval: 100, // poll interval in ms, default 250ms
    simultaneous: 1, // limit to 1 connection per resource at a time
    timeout: timeout, // timeout in ms, default Infinity
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

// TODO: Possibly add this to decrease initial load time
// const prerun = async () => {
//   try {
//     fs.readFileSync('./pid.txt');
//   } catch (error) {
//     exec(`bash start.sh`);
//     delay = 0;
//     timeout = 20000;
//     await wait();
//     exec(`bash stop.sh`);
//     delay = 2000;
//     timeout = 3000;
//     await wait();
//   }
// }

// prerun();

app.post('/start', async (req, res) => {
  delay = 1000;
  timeout = 3000;
  const test = await wait();

  if(test) {
    res.send({status: 'running'});
  } else {
    exec(`bash start.sh`);
    delay = 0;
    timeout = 20000;
    const result = await wait();
  
    if(result) {
      res.send({status: 'success', message: `firebase ui at ${uiUrl}`});
    } else {
      res.send({status: 'error'});
    }
  }
});

app.post('/stop', async (req, res) => {
  exec(`bash stop.sh`);
  delay = 2000;
  timeout = 3000;
  const result = await wait();

  if(!result) {
    res.send({status: 'success'});
  } else {
    res.send({status: 'error'});
  }
});

app.listen(port, () => console.log(`Firebase launcher is listening on port ${port}.`));