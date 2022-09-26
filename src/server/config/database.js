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

  logger.debug('\n' + query);

  try {

    // 쿼리조회
    if(conn){
      let rows = await conn.query(query);
      if(rows.length > 1){
        await conn.rollback();
        conn.release();
        throw new Error('TOO_MAYN_RESULT');
      }else{
        return rows[0];
      }
    }else{
      let connection = await this.pool.getConnection();
      let rows = await connection.query(query);
      if(rows.length > 1){
        await connection.rollback();
        connection.release();
        throw new Error('TOO_MAYN_RESULT');
      }else{
        return rows[0];
      }
    }
  }catch(error){
    throw error;
  }
};

exports.selectList = async (query, conn) => {
  
}

exports.update = async (query, conn) => {
  
}

exports.insert = async (query, conn) => {
  
}

exports.delete = async (query, conn) => {
  
}