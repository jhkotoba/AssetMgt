const pool = require(`${basePath}/config/database.js`);

/**
 * 회원정보 조회
 * @param {string} userId 
 * @returns 
 */
 exports.selectUser = async conn => {

    `SELECT
    	MENU_NO
    	, MENU_NM
    	, MENU_URL
    	, MENU_LV
    	, MENU_SEQ
    	, GROUP_NO
    	, DISP_YN
    	, USE_YN
    	, INS_NO
    	, DATE_FORMAT(INS_DTTM, '%Y-%m-%d %H:%i:%S') AS INS_DTTM
    	, UPT_NO
    	, DATE_FORMAT(UPT_DTTM, '%Y-%m-%d %H:%i:%S') AS UPT_DTTM
    FROM MENU
    `
    if(conn){
        let result = await conn.query(query);
        return result;
    }else{
        let connection = await pool.getConnection();
        let result = await connection.query(query);
        await connection.commit();
        connection.release();
        return result;
    }
}