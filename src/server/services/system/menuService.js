const menuRepository = require(`${basePath}/repository/menu/menuRepository.js`);
const database = require(`${basePath}/config/database.js`);

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

    // 상위하위 메뉴 구분(1:상위, 2:하위)
    let level = param.menuLv;

    let insertList = [];
    let updateList = [];
    let deleteList = [];
    
    for(let item of param.applyList){
        switch(item._state){
            case 'INSERT':
                insertList.push(item);
                break;
            case 'UPDATE':
                updateList.push(item);
                break;
            case 'REMOVE':
                deleteList.push(item);
                break;
        }
    }

    // return new Promise((resolve, reject) => {
    //     resolve('OK');
    // });
}
