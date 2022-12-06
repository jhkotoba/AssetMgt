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
        WHERE 1=1
        ${params?.groupCd ? " AND GROUP_CD = '" + params.groupCd + "' AND CODE <> GROUP_CD " : ' '}
        ORDER BY GROUP_CD`, conn);
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

/**
 * 코드 수정
 * @param {*} params 
 * @param {*} conn 
 */
exports.updateCodeList = async (params, conn) => {
    logger.debug(`codeRepository.updateCodeList \n params:: [${JSON.stringify(params)}]`);
    let query = 
    ` /* menuRepository.updateCodeList */
    UPDATE SY_CODE M JOIN (
        SELECT
            CODE
            , CODE_NM
            , GROUP_CD
            , USE_YN
            , UPT_NO
            , UPT_DTTM
        FROM (
    `;
    for(let i=0; i<params.updateList.length; i++){
        let p = params.updateList[i];
        query += `      SELECT ${repo.string(p.code)} AS CODE,  ${repo.string(p.codeNm)} AS CODE_NM, ${repo.string(p.groupCd)} AS GROUP_CD, ${repo.string(p.useYn)} AS USE_YN`
        if(i+1 < params.updateList.length){
            query += ' UNION ALL \n';
        }
    }
    query += `
        ) A
        INNER JOIN SY_CODE C
        ON M.CODE = C.CODE
        AND M.CODE IN (` + params.updateList.map(item => item.code).join() + `)
    ) U
    ON U.CODE = M.CODE
    SET
    M.CODE = U.CODE
    , M.CODE_NM = U.CODE_NM
    , M.GROUP_CD = U.GROUP_CD
    , M.USE_YN = U.USE_YN
    , M.UPT_NO = ${params.userNo}
    , M.UPT_DTTM = NOW()    
    `;
    return await repo.update(query, conn);
}

/**
 * 코드 삭제
 * @param {*} params 
 * @param {*} conn 
 */
exports.deleteCodeList = async (params, conn) => {
    logger.debug(`codeRepository.deleteCodeList \n params:: [${JSON.stringify(params)}]`);

    return await repo.delete(`
    DELETE FROM SY_CODE
    WHERE 1=1
    AND CODE IN (${params.deleteList.map(item => repo.string(item.code)).join()})
    `, conn);
}