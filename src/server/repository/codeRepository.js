const logger = require(`${basePath}/config/logger.js`);
const repo = require(`${basePath}/config/repository.js`);

/**
 * 공통코드 목록 조회
 * @returns 
 */
 exports.selectCodeList = async conn => {

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
        FROM SY_CODE`, conn);
}