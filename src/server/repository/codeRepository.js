const logger = require(`${basePath}/config/logger.js`);
const repo = require(`${basePath}/config/repository.js`);

/**
 * 공통코드 조회(view)
 * @returns 
 */
exports.selectViewCodeList = async (params, conn) => {

    return await repo.selectList(
        `/* codeRepository.selectViewCodeList */
        SELECT
            CODE      AS code
            , CODE_NM   AS codeNm
            , GROUP_CD  AS groupCd
        FROM SY_CODE
        WHERE USE_YN = 'Y'
        ${params?.groupCdList ? " AND GROUP_CD IN ('" + params.groupCdList.join("','") + "') AND CODE <> GROUP_CD " : ' '}
        ORDER BY GROUP_CD`, conn);
}

/**
 * 공통코드 카운트 조회
 * @param {*} params 
 * @param {*} conn 
 */
exports.selectCodeCount = async(params, conn) => {

    return await repo.selectOne(
        `/* codeRepository.selectCodeCount */
        SELECT COUNT(1) AS totalCount FROM SY_CODE 
        WHERE 1=1
        ${params?.groupCd ? " AND GROUP_CD = '" + params.groupCd : ' '}
        ${params?.code ? " AND CODE = " + repo.string(params.code) : ' '}
        ${params?.useYn ? " AND USE_YN = " + repo.string(params.useYn) : ' '}
        `, conn);
}

/**
 * 공통코드 목록 조회
 * @param {*} params 
 * @param {*} conn 
 */
 exports.selectCodeList = async (params, conn) => {

    return await repo.selectList(
        `/* codeRepository.selectCodeList */
        -- pageNo: ${params.paging.pageNo}
        -- pageSize: ${params.paging.pageSize}
        SELECT
            CODE_NO     AS codeNo
            , CODE      AS code
            , CODE_NM   AS codeNm
            , GROUP_CD  AS groupCd
            , USE_YN    AS useYn
            , INS_NO    AS insNo
            , DATE_FORMAT(INS_DTTM, '%Y-%m-%d %H:%i:%S') AS insDttm
            , UPT_NO    AS uptNo
            , DATE_FORMAT(UPT_DTTM, '%Y-%m-%d %H:%i:%S') AS uptDttm
        FROM SY_CODE
        WHERE 1=1
        ${params?.groupCd ? " AND GROUP_CD = '" + params.groupCd : ' '}
        ${params?.code ? " AND CODE = " + repo.string(params.code) : ' '}
        ${params?.useYn ? " AND USE_YN = " + repo.string(params.useYn) : ' '}
        LIMIT ${(params.paging.pageNo -1) * params.paging.pageSize}, ${params.paging.pageSize}`, conn);
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
            A.CODE_NO
            , A.CODE
            , A.CODE_NM
            , A.GROUP_CD
            , A.USE_YN
            , ${params.userNo} AS UPT_NO
            , NOW() AS UPT_DTTM
        FROM (
    `;
    for(let i=0; i<params.updateList.length; i++){
        let p = params.updateList[i];
        query += `      SELECT ${p.codeNo} AS CODE_NO, ${repo.string(p.code)} AS CODE,  ${repo.string(p.codeNm)} AS CODE_NM, ${repo.string(p.groupCd)} AS GROUP_CD, ${repo.string(p.useYn)} AS USE_YN`
        if(i+1 < params.updateList.length){
            query += ' UNION ALL \n';
        }
    }
    query += `
        ) A
        INNER JOIN SY_CODE C
        ON A.CODE_NO = C.CODE_NO
        AND C.CODE_NO IN (` + params.updateList.map(item => item.codeNo).join() + `)
    ) U
    ON U.CODE_NO = M.CODE_NO
    SET
    M.CODE = U.CODE
    , M.CODE_NM = U.CODE_NM
    , M.GROUP_CD = U.GROUP_CD
    , M.USE_YN = U.USE_YN
    , M.UPT_NO = U.UPT_NO
    , M.UPT_DTTM = U.UPT_DTTM   
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
    AND CODE_NO IN (${params.deleteList.map(item => repo.string(item.codeNo)).join()})
    `, conn);
}