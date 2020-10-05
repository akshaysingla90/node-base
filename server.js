
'use strict';

/***********************************
 **** node module defined here *****
 ***********************************/
require('dotenv').config();
const EXPRESS = require("express");
const CONFIG = require('./config');
/**creating express server app for server */
const app = EXPRESS();

/********************************
 ***** Server Configuration *****
 ********************************/
app.set('port', CONFIG.server.PORT);

// configuration to setup socket.io on express server.
const server = require('http').Server(app);
global.io = require('socket.io')(server);

/** Server is running here */
let startNodeserver = async () => {
  // express startup.
  await require(`./app/startup/hm/expressStartup`)(app);
  // start socket on server
  // await require(`./app/socket/hm/socket`).connect(global.io, p2p);

  return new Promise((resolve, reject) => {
    server.listen(CONFIG.server.PORT, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};


startNodeserver()
  .then(async () => {
    console.log('Node server running on ', CONFIG.server.URL);
  }).catch((err) => {
    console.log('Error in starting server', err);
    process.exit(1);
  });

process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error);
});