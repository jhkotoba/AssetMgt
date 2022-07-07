const pool = require(`${basePath}/config/database.js`);

// 회원정보 조회
exports.selectUser = async (userId) => {

    let conn = await pool.getConnection();
    let result = await conn.query(
        `SELECT
            USER_NO     AS userNo
            , USER_ID   AS userId
            , PASSWORD  AS password
            , SALT      AS salt
            , EMAIL     AS email
        FROM UR_USER
        WHERE 1=1
        AND USER_ID = '${userId}'
        `
    )
    conn.release();
    return result[0];
}