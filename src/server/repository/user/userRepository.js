const pool = require(`${basePath}/config/database.js`);

exports.selectUser = async (userId) => {
    
    let conn = await pool.getConnection();
    return await conn.query(
        `SELECT 
            ADMIN_NO        AS adminNo
            , ADMIN_ID      AS adminId
            , PHONE         AS phone
            , EMAIL         AS email
            , ADMIN_ST_CD   AS adminStCd
        FROM ADMIN
        WHERE 1=1
        AND USE_YN = 'Y'
        AND ADMIN_ID = '${userId}'`
    )
}