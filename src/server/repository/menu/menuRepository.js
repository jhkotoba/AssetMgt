const repository = require(`${basePath}/config/repository.js`);

/**
 * 메뉴목록 조회
 * @returns 
 */
 exports.selectMenuList = async conn => {

    return await repository.selectList(
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
        FROM MENU`
    , conn);
}

/**
 * 메뉴목록 저장
 * @param {*} params 
 * @param {*} conn 
 * @returns 
 */
exports.insertMenuList = async (params, conn) => {

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
    return await repository.insert(query, conn);
}