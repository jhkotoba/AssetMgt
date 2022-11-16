const logger = require(`${basePath}/config/logger.js`);
const repo = require(`${basePath}/config/repository.js`);

/**
 * 메뉴목록 조회
 * @returns 
 */
 exports.selectMenuList = async conn => {

    return await repo.selectList(
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
        FROM MENU`, conn);
}

/**
 * 메뉴목록 저장
 * @param {*} params 
 * @param {*} conn 
 * @returns 
 */
exports.insertMenuList = async (params, conn) => {
    logger.debug(`menuRepository.insertMenuList \n params:: [${JSON.stringify(params)}]`);
    let query = `
    /* menuRepository.insertMenuList */
    INSERT INTO MENU (
        ${params.level == 1 ? 'MENU_NM' : 'MENU_URL'}
        , MENU_LV
        , MENU_SEQ
        , GROUP_NO
        , DISP_YN
        , USE_YN
        , INS_NO
        , INS_DTTM
        , UPT_NO
        , UPT_DTTM
    ) \n`;
    let list = params.insertList;
    for(let i=0; i<list.length; i++){
        query += ' SELECT ';
        if(params.level == 1){
            query += `'${list[i].menuNm}'`;
        }else{
            query += `'${list[i].menuUrl}'`;
        }
        query += `, '${params.level}'`;
        query += `, ${list[i].menuSeq}`;
        if(params.level == 1){
            query += ', 0';
        }else if(params.level == 2){
            query += `, ${list[i].groupNo}`;
        }
        query += `, '${list[i].dispYn}'`
        query += `, '${list[i].useYn}'`
        query += `, '${params.userNo}'`;
        query += ', NOW()';
        query += `, '${params.userNo}'`;
        query += ', NOW() \n';
        if(i+1 < list.length){
            query += ' UNION ALL \n';
        }
    }
    return await repo.insert(query, conn);
}

/**
 * 
 * @param {*} params 
 * @param {*} conn 
 */
exports.updateMenuList = async (params, conn) => {
    logger.debug(`menuRepository.updateMenuList \n params:: [${JSON.stringify(params)}]`);
    let query = 
    ` /* menuRepository.updateMenuList */
    UPDATE MENU M JOIN (
        SELECT
            M.MENU_NO
            , ${params.level == 1 ? 'IFNULL(A.MENU_NM, M.MENU_NM) AS MENU_NM' : 'IFNULL(A.MENU_URL, M.MENU_URL) AS MENU_URL'}
            , IFNULL(A.MENU_LV, M.MENU_LV) AS MENU_LV
            , IFNULL(A.MENU_SEQ, M.MENU_SEQ) AS MENU_SEQ
            , IFNULL(A.GROUP_NO, M.GROUP_NO) AS GROUP_NO
            , IFNULL(A.DISP_YN, M.DISP_YN) AS DISP_YN
            , IFNULL(A.USE_YN, M.USE_YN) AS USE_YN
        FROM (
    `;
    for(let i=0; i<params.updateList.length; i++){
        let p = params.updateList[i];
        query += `      SELECT ${p.menuNo} AS MENU_NO, ${repo.string(p.menuNm)} AS MENU_NM, ${repo.string(p.menuUrl)} AS MENU_URL, ${p.menuLv} AS MENU_LV, ${p.menuSeq} AS MENU_SEQ, ${p.groupNo} AS GROUP_NO, ${repo.string(p.dispYn)} AS DISP_YN, ${repo.string(p.useYn)} AS USE_YN`
        if(i+1 < params.updateList.length){
            query += ' UNION ALL \n';
        }
    }
    query += `
        ) A
        INNER JOIN MENU M
        ON M.MENU_NO = A.MENU_NO
        AND M.MENU_NO IN (` + params.updateList.map(item => item.menuNo).join() + `)
    ) U
    ON U.MENU_NO = M.MENU_NO
    SET
    ${params.level == 1 ? 'M.MENU_NM = U.MENU_NM' : 'M.MENU_URL = U.MENU_URL'}
    , M.MENU_LV = U.MENU_LV 
    , M.MENU_SEQ = U.MENU_SEQ
    , M.GROUP_NO = U.GROUP_NO
    , M.DISP_YN = U.DISP_YN
    , M.USE_YN = U.USE_YN
    , M.UPT_NO = ${params.userNo}
    , M.UPT_DTTM = NOW()
    `;
    return await repo.update(query, conn);
}

/**
 * 
 * @param {*} params 
 * @param {*} conn 
 */
exports.deleteMenuList = async (params, conn) => await repo.delete('DELETE FROM MENU WHERE 1=1 AND MENU_NO IN (' + params.deleteList.map(item => item.menuNo).join() + ')', conn);