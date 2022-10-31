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

exports.insertMenuList = async conn => {






}