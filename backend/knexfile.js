require('dotenv').config();

const common = {
  client: process.env.DB_CLIENT || 'mysql2',
  connection: {
    host: '127.0.0.1',
    user: 'pharmacy_dev',
    password: 'McTimes001!@#',
    database: 'pharmacy_pos_dev',
    port: 3306,
  },
  pool: { min: 2, max: 10 },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations'
  },
  seeds: { directory: './seeds' }
};

module.exports = {
  development: common,
  production: Object.assign({}, common, {
    connection: process.env.DATABASE_URL || common.connection
  })
};
