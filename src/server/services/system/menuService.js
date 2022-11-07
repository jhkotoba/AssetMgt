const menuRepository = require(`${basePath}/repository/menu/menuRepository.js`);
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
exports.applyMenu =  async (params) => {

    // 상위하위 메뉴 구분(1:상위, 2:하위)
    let level = params.menuLv;
    let userNo = params.userNo;

    let insertList = [];
    let updateList = [];
    let deleteList = [];
    
    for(let item of params.applyList){
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

    // DB연결
    let conn = await db.getConnection();
    // 트렌젝션
    await conn.beginTransaction();

    console.log('------------------------------------>');
    console.log('insertList:', insertList);

    
    await menuRepository.insertMenuList({insertList, userNo, level}, conn);
    


    console.log('------------------------------------> END');
    // 커밋
    await conn.commit();
    conn.release();

    // await conn.rollback();
    // conn.release();
    // throw new Error('INSERT_FAIL');

    // return new Promise((resolve, reject) => {
    //     resolve('OK');
    // });
}
