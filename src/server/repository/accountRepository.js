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
            , ACCT_NUM      AS acctNum
            , ACCT_NM       AS acctNm
            , USER_NO       AS userNo
            , BANK_CD       AS bankCd
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