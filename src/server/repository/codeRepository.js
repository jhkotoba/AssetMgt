const logger = require(`${basePath}/config/logger.js`);
const repo = require(`${basePath}/config/repository.js`);

/**
 * 공통코드 목록 조회
 * @returns 
 */
 exports.selectCodeList = async (params, conn) => {

    return await repo.selectList(
        `/* codeRepository.selectCodeList */
        SELECT
            CODE        AS code
            , CODE_NM   AS codeNm
            , GROUP_CD  AS groupCd
            , USE_YN    AS useYn
            , INS_NO    AS insNo
            , DATE_FORMAT(INS_DTTM, '%Y-%m-%d %H:%i:%S') AS insDttm
            , UPT_NO    AS uptNo
            , DATE_FORMAT(UPT_DTTM, '%Y-%m-%d %H:%i:%S') AS uptDttm
        FROM SY_CODE 
        ORDER BY GROUP_CD 
        WHERE 1=1
        ${params?.groupCd ? "AND GROUP_CD = '" + params.groupCd + "' AND CODE <> GROUP_CD" : ''}
        `, conn);
}

/**
 * 코드 저장
 * @param {*} params 
 * @param {*} conn 
 * @returns 
 */
 exports.insertCodeList = async (params, conn) => {
    logger.debug(`codeRepository.insertCodeList \n params:: [${JSON.stringify(params)}]`);
    let query = `
    /* codeRepository.insertCodeList */
    INSERT INTO SY_CODE (
        CODE
        , CODE_NM
        , GROUP_CD
        , USE_YN
        , INS_NO
        , INS_DTTM
        , UPT_NO
        , UPT_DTTM
    ) VALUES \n`;
    params.insertList
        .forEach((item, idx) => query += (idx == 0 ? '\n' : '\n, ') + `('${item.code}', '${item.codeNm}', '${item.groupCd}', 'Y', ${params.userNo}, NOW(), ${params.userNo}, NOW())`);

    return await repo.insert(query, conn);
}