const CronJob = require('cron').CronJob;
const bot = require('./bot.js');
const http = require("http");

new CronJob('*/30 * * * * *',
  bot.start,
  null,
  true,
  'America/Los_Angeles');
