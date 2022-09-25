// DB - MARIADB
const mariadb = require("mariadb");
const logger = require(`${basePath}/config/logger.js`);

// DB 정보
const info = {
  host: process.env.MARIA_HOST,
  user: process.env.MARIA_UESR,
  password: process.env.MARIA_PASSWORD,
  database: process.env.MARIA_DATABASE,
  connectionLimit: 50,
  rowsAsArray: false
}

// Pool 초기화
exports.pool = mariadb.createPool(info);

// 단건 조회 쿼리문 실행
exports.selectOne = async (query, conn) => {

  // 로그출력
  logger.debug('\n' + query);
  
  if(conn){
    let result = await conn.query(query);
    return result[0];
  }else{
    let connection = await this.pool.getConnection();
    let result = await connection.query(query);
    await connection.commit();
    connection.release();
    return result[0];
  }
}

exports.selectList = async (query, conn) => {
  
}

exports.update = async (query, conn) => {
  
}

exports.insert = async (query, conn) => {
  
}

exports.delete = async (query, conn) => {
  
}