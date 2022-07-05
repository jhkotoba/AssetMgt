// DB - MARIADB
const mariadb = require("mariadb");

// Pool 초기화
const pool = mariadb.createPool({
  host: process.env.MARIA_HOST,
  user: process.env.MARIA_UESR,
  password: process.env.MARIA_PASSWORD,
  database: process.env.MARIA_DATABASE,
  connectionLimit: 50,
  rowsAsArray: false
});

module.exports = pool;