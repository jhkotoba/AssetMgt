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

/**
 * 코드 등록/수정/삭제 적용
 * @param {*} param 
 */
exports.applyAccount = async (params) => {
    
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
        cnts.insertCnt > 0 ? await accountRepository.insertAccountList({insertList, userNo}, conn) : null,
        cnts.updateCnt > 0 ? await accountRepository.updateAccountList({updateList, userNo}, conn) : null,
        cnts.deleteCnt > 0 ? await accountRepository.deleteAccountList({deleteList, userNo}, conn) : null
    ]).then(values => {
        if(cnts.insertCnt != values[0]?.affectedRows ? values[0]?.affectedRows : 0){
            return Promise.reject(new Error('ISNERT_COUNT_DIFFERENT'));
        }else if(cnts.updateCnt != values[1]?.affectedRows ? values[1]?.affectedRows : 0){
            return Promise.reject(new Error('UPDATE_COUNT_DIFFERENT'));
        }else if(cnts.deleteCnt != values[2]?.affectedRows ? values[2]?.affectedRows : 0){
            return Promise.reject(new Error('DELETE_COUNT_DIFFERENT'));
        }else{  
            return cnts;
        }
    }).catch(async error => {
        logger.error('applyAccount ERROR ::', error);
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