module.exports = require('knex')({
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5433,
      user: 'webster',
      password: 'webster',
      database: 'webster',
    }
})
  