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
  let connection = null;

  try {

    // 쿼리조회
    if(conn){
      let rows = await conn.query(query);
      if(rows.length > 1){
        throw new Error('TOO_MAYN_RESULT');
      }else{
        return rows[0];
      }
    }else{
      connection = await this.pool.getConnection();
      let rows = await connection.query(query);
      if(rows.length > 1){
        throw new Error('TOO_MAYN_RESULT');
      }else{
        return rows[0];
      }
    }
  }catch(error){
    if(conn){
      await conn.rollback();
      conn.release();
    }
    if(connection){
      await connection.rollback();
      connection.release();
    }
    throw error;
  }
};

// 복수건 조회
exports.selectList = async (query, conn) => {
  logger.debug('\n' + query);
  let connection = null;

  try {

    // 쿼리조회
    if(conn){
      return await conn.query(query);
    }else{
      connection = await this.pool.getConnection();
      return await connection.query(query);
    }
  }catch(error){
    if(conn){
      await conn.rollback();
      conn.release();
    }
    if(connection){
      await connection.rollback();
      connection.release();
    }
    throw error;
  }
}

// 저장
exports.insert = async (query, conn) => {

  logger.debug('\n' + query);
  let connection = null;
  try {
    if(conn){
      let result = await conn.query(query);
      return result;
    }else{
      connection = await database.pool.getConnection();
      let result = await connection.query(query);
      await connection.commit();
      connection.release();
      return result;
    }
  }catch(error){
    if(conn){
      await conn.rollback();
      conn.release();
    }
    if(connection){
      await connection.rollback();
      connection.release();
    }
    throw(error);
  }
}

// 수정
exports.update = async (query, conn) => {
  
}

// 삭제
exports.delete = async (query, conn) => {
  
}