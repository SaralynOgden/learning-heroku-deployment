const CronJob = require('cron').CronJob;
const bot = require('./bot.js');

new CronJob('* */01 * * * *',
  bot.start,
  null,
  true,
  'America/Los_Angeles');
