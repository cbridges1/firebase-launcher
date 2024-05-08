require('dotenv').config();
const fs = require('fs');

const express = require('express');
const {exec} = require('child_process');
var waitOn = require('wait-on');

const app = express();

const port = process.env.SERVER_PORT ? process.env.SERVER_PORT : 1000;

let delay = 2000;
let timeout = 3000;
let initialLoad = false;

const uiUrl = `http://localhost:${process.env.UI_PORT}`;

const wait = (timeoutOverride) => {
  const opts = {
    resources: [
      uiUrl,
    ],
    delay: delay, // initial delay in ms, default 0
    interval: 100, // poll interval in ms, default 250ms
    simultaneous: 1, // limit to 1 connection per resource at a time
    timeout: timeoutOverride ? timeoutOverride : timeout, // timeout in ms, default Infinity
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

// TODO: Review to see if this is decreasing initial load time
const prerun = async () => {
  try {
    fs.readFileSync('./pid.txt');
  } catch (error) {
    initialLoad = true;
    exec(`bash start.sh`);
    delay = 0;
    timeout = 24000;
    await wait();
    exec(`bash stop.sh`);
    delay = 2000;
    timeout = 3000;
    await wait();
    initialLoad = false;
  }
}

prerun();

app.post('/start', async (req, res) => {
  if(initialLoad) {
    await wait(20000);
  }

  delay = 1000;
  timeout = 3000;
  const test = await wait();

  if(test) {
    res.send({status: 'running'});
  } else {
    const result = await start();
  
    if(result) {
      res.send({status: 'success', message: `firebase ui at ${uiUrl}`});
    } else {
      res.send({status: 'error'});
    }
  }
});

app.post('/stop', async (req, res) => {
  if(initialLoad) {
    res.send({status: 'initial load in progress'});
  }

  const result = await stop();
  if(!result) {
    res.send({status: 'success'});
  } else {
    res.send({status: 'error'});
  }
});

app.post('/reset', async (req, res) => {
  if(initialLoad) {
    res.send({status: 'initial load in progress'});
  }
  
  const result = await stop();
  if(!result) {
    fs.rmdir("data", { 
      recursive: true, 
    }, (error) => { 
      if (error) { 
        console.log(error); 
      } 
      else { 
        console.log("Firebase data removed"); 
      } 
    }); 
    res.send({status: 'success'});
  } else {
    res.send({status: 'error'});
  }
});

const start = async () => {
  exec(`bash start.sh`);
  delay = 0;
  timeout = 24000;
  return await wait();
}

const stop = async () => {
  exec(`bash stop.sh`);
  delay = 2000;
  timeout = 3000;
  return await wait();
}

app.listen(port, () => console.log(`Firebase launcher is listening on port ${port}.`));