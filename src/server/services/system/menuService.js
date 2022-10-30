const menuRepository = require(`${basePath}/repository/menu/menuRepository.js`);
const pool = require(`${basePath}/config/database.js`);

/**
 * 메뉴목록 조회
 * @param {object} params 
 * @returns 
 */
exports.getMenuList = async () => {
    let menuList = await menuRepository.selectMenuList();
    if(menuList.length < 1){
        throw new Error('NO_SEARCH_MENU');
    }

    return menuList;
}

/**
 * 메뉴정보 등록/수정/삭제 적용
 * @param {*} param 
 */
exports.applyMenu =  async (param) => {

    return new Promise((resolve, reject) => {
        resolve('OK');
    });
}
