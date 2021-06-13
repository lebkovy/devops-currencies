const knex = require('knex')
const keys = require('./keys');

module.exports = knex({
  client: 'postgres',
  connection: {
    host: keys.pgHost,
    user: keys.pgUser,
    password: keys.pgPassword,
    database: keys.pgDatabase,
    port: keys.pgPort
  },
})
