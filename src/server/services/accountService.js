const logger = require(`${basePath}/config/logger.js`);
const accountRepository = require(`${basePath}/repository/accountRepository.js`);
const db = require(`${basePath}/config/database.js`);

/**
 * 계좌목록 조회
 * @param {*} params 
 * @returns 
 */
exports.getAccountList = async params => {
    return Promise.all([
        accountRepository.selectAccountCount(params),
        accountRepository.selectAccountList(params)
    ]).then(values => {
        params.paging.totalCount = Number(values[0].totalCount);
        return {list: values[1], params}
    }).catch(async error => {
        logger.error('getAccountList ERROR ::', error);
        return Promise.reject(error);
    });
}