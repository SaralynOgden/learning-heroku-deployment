const CronJob = require('cron').CronJob;
const bot = require('./bot.js');
const http = require("http");

new CronJob('*/01 * * * * *',
  bot.start,
  null,
  true,
  'America/Los_Angeles');

// setInterval(function() {
//   http.get("http://chase.herokuapp.com");
// }, 300000);
