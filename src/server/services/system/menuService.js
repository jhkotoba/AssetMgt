const menuRepository = require(`${basePath}/repository/menu/menuRepository.js`);
const pool = require(`${basePath}/config/database.js`);

/**
 * 메뉴목록 조회
 * @param {object} params 
 * @returns 
 */
exports.getMenuList = async () => menuRepository.selectMenuList();