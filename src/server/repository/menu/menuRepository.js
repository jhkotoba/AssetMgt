const database = require(`${basePath}/config/database.js`);
const logger = require(`${basePath}/config/logger.js`);

/**
 * 메뉴목록 조회
 * @returns 
 */
 exports.selectMenuList = async conn => {

    let query = 
    `/* menuRepository.selectMenuList */
    SELECT
    	MENU_NO     AS menuNo
    	, MENU_NM   AS menuNm
    	, MENU_URL  AS menuUrl
    	, MENU_LV   AS menuLv
    	, MENU_SEQ  AS menuSeq
    	, GROUP_NO  AS groupNo
    	, DISP_YN   AS dispYn
    	, USE_YN    AS useYn
    	, INS_NO    AS insNo
    	, DATE_FORMAT(INS_DTTM, '%Y-%m-%d %H:%i:%S') AS insDttm
    	, UPT_NO    AS uptNo
    	, DATE_FORMAT(UPT_DTTM, '%Y-%m-%d %H:%i:%S') AS uptDttm
    FROM MENU
    `;
    logger.debug('\n' + query);

    if(conn){
        let result = await conn.query(query);
        return result;
    }else{
        let connection = await database.pool.getConnection();
        let result = await connection.query(query);
        await connection.commit();
        connection.release();
        return result;
    }
}