'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/testing_cron'
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
