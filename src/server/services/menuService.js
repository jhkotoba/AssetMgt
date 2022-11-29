const logger = require(`${basePath}/config/logger.js`);
const menuRepository = require(`${basePath}/repository/menuRepository.js`);
const db = require(`${basePath}/config/database.js`);

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
exports.applyMenu = async (params) => {

    // 상위하위 메뉴 구분(1:상위, 2:하위)
    const level = params.menuLv;
    const userNo = params.userNo;
    let insertList = [];
    let updateList = [];
    let deleteList = [];
    
    // 데이터 세팅
    for(let item of params.applyList){
        switch(item._state){
        case 'INSERT': insertList.push(item); break;
        case 'UPDATE': updateList.push(item); break;
        case 'REMOVE': deleteList.push(item); break;
        }
    }
    const cnts = {insertCnt: insertList.length, updateCnt: updateList.length, deleteCnt: deleteList.length};

    // DB연결
    let conn = await db.getConnection();
    // 트렌젝션
    await conn.beginTransaction();
    
    // 적용사항 저장/수정/삭제
    return Promise.all([
        cnts.insertCnt > 0 ? await menuRepository.insertMenuList({insertList, userNo, level}, conn) : null,
        cnts.updateCnt > 0 ? await menuRepository.updateMenuList({updateList, userNo, level}, conn) : null,
        cnts.deleteCnt > 0 ? await menuRepository.deleteMenuList({deleteList, userNo, level}, conn) : null
    ]).then(values => {
        if(cnts.insertCnt != values[0]?.affectedRows ? values[0]?.affectedRows : 0){
            return Promise.reject(new Error('ISNERT_COUNT_DIFFERENT'));
        }else if(cnts.updateCnt != values[1]?.affectedRows ? values[1]?.affectedRows : 0){
            return Promise.reject(new Error('UPDATE_COUNT_DIFFERENT'));
        }else if(cnts.deleteCnt > 0 && values[2]?.affectedRows == undefined){
            return Promise.reject(new Error('DELETE_COUNT_DIFFERENT'));
        }else{  
            return cnts;
        }
    }).catch(async error => {
        logger.error('applyMenu ERROR ::', error);
        if(conn){
            await conn.rollback();
            conn.release();
        }
        return Promise.reject(error);
    }).finally(async () => {
        if(conn){
            await conn.commit();
            conn.release();
        }
    });
}
