const logger = require(`${basePath}/config/logger.js`);
const codeRepository = require(`${basePath}/repository/codeRepository.js`);
const db = require(`${basePath}/config/database.js`);

/**
 * 메뉴목록 조회
 * @param {object} params 
 * @returns 
 */
 exports.getCodeList = () => codeRepository.selectCodeList();