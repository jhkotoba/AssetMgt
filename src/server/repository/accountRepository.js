const logger = require(`${basePath}/config/logger.js`);
const repo = require(`${basePath}/config/repository.js`);

/**
 * 계좌목록 카운트 조회
 * @param {*} params 
 * @param {*} conn 
 */
exports.selectAccountCount = async(params, conn) => {

    return await repo.selectOne(
        `/* accountRepository.selectAccountCount */
        SELECT COUNT(1) AS totalCount FROM AC_ACCOUNT 
        WHERE 1=1
        AND USER_NO = ${params.userNo}`, conn);
}

/**
 * 계좌목록 조회
 * @param {*} params 
 * @param {*} conn 
 */
 exports.selectAccountList = async (params, conn) => {

    return await repo.selectList(
        `/* accountRepository.selectAccountList */
        SELECT
            ACCT_NO         AS acctNo
            , USER_NO       AS userNo
            , BANK_CD       AS bankCd
            , ACCT_TP_CD    AS acctTpCd
            , ACCT_NM       AS acctNm
            , ACCT_NUM      AS acctNum
            , ACCT_SEQ      AS acctSeq
            , CUR_MONEY     AS curMoney
            , USE_YN        AS useYn
            , INS_NO        AS insNo
            , DATE_FORMAT(INS_DTTM, '%Y-%m-%d %H:%i:%S') AS insDttm
            , UPT_NO        AS uptNo
            , DATE_FORMAT(UPT_DTTM, '%Y-%m-%d %H:%i:%S') AS uptDttm
        FROM AC_ACCOUNT
        WHERE 1=1
        AND USER_NO = ${params.userNo}
        LIMIT ${(params.paging.pageNo - 1) * params.paging.pageSize}, ${params.paging.pageSize}`, conn);
}

/**
 * 계좌목록 저장
 * @param {*} params 
 * @param {*} conn 
 * @returns 
 */
exports.insertAccountList = async (params, conn) => {
    logger.debug(`accountRepository.insertAccountList \n params:: [${JSON.stringify(params)}]`);
    let query = `
    /* accountRepository.insertAccountList */
    INSERT INTO AC_ACCOUNT (
        , USER_NO
        , BANK_CD
        , ACCT_TP_CD
        , ACCT_NM
        , ACCT_NUM
        , ACCT_SEQ
        , CUR_MONEY
        , USE_YN
        , INS_NO
        , INS_DTTM
        , UPT_NO
        , UPT_DTTM
    ) VALUES \n`;
    params.insertList
        .forEach((item, idx) => query += (idx == 0 ? '\n' : '\n, ') + `(${params.userNo}, ${repo.string(item.bankCd)}, ${repo.string(item.acctTpCd)}, ${repo.string(item.acctNm)}, ${repo.string(item.acctNum)}, ${repo.int(item.acctSeq)}, 0, ${repo.string(item.useYn)}, NOW(), ${params.userNo}, NOW())`);

    return await repo.insert(query, conn);
}

/**
 * 계좌 수정
 * @param {*} params 
 * @param {*} conn 
 */
exports.updateAccountList = async (params, conn) => {
    logger.debug(`accountRepository.updateAccountList \n params:: [${JSON.stringify(params)}]`);

    // 수정할 계좌 키 값
    let updateNo = params.updateList.map(item => item.acctNo).join();

    // 쿼리문 작성
    let query = 
    ` /* accountRepository.updateAccountList */
    UPDATE AC_ACCOUNT M JOIN (
        SELECT
            A.ACCT_NO
            , A.ACCT_NUM
            , A.ACCT_NM
            , A.BANK_CD
            , A.ACCT_TP_CD
            , A.ACCT_SEQ
            , A.USE_YN
            , ${params.userNo} AS UPT_NO
            , NOW() AS UPT_DTTM
        FROM (
    `;
    for(let i=0; i<params.updateList.length; i++){
        let p = params.updateList[i];
        query += `      SELECT ${p.acctNo} AS ACCT_NO, ${repo.string(p.acctNum)} AS ACCT_NUM, ${repo.string(p.acctNm)} AS ACCT_NM,  ${repo.string(p.bankCd)} AS BANK_CD, ${repo.string(p.acctTpCd)} ACCT_TP_CD, ${repo.int(p.acctSeq)} AS ACCT_SEQ, ${repo.string(p.useYn)} AS USE_YN`
        if(i+1 < params.updateList.length){
            query += ' UNION ALL \n';
        }
    }
    query += `
        ) A
        INNER JOIN AC_ACCOUNT C
        ON A.ACCT_NO = C.ACCT_NO
        AND C.ACCT_NO IN (${updateNo})
    ) U
    ON U.ACCT_NO = M.ACCT_NO
    SET
    M.ACCT_NUM = U.ACCT_NUM
    , M.ACCT_NM = U.ACCT_NM
    , M.BANK_CD = U.BANK_CD
    , M.ACCT_TP_CD = U.ACCT_TP_CD
    , M.ACCT_SEQ = U.ACCT_SEQ
    , M.USE_YN = U.USE_YN
    , M.UPT_NO = U.UPT_NO
    , M.UPT_DTTM = U.UPT_DTTM
    WHERE M.ACCT_NO IN (${updateNo})
    `;
    return await repo.update(query, conn);
}