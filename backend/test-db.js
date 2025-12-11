const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'pharmacy_dev',
  password: 'McTimes001!@#',
  database: 'pharmacy_pos_dev',
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error('Connection error:', err.message);
  } else {
    console.log('Connected to MySQL!');
  }
  connection.end();
});
