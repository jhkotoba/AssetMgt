const logger = require(`${basePath}/config/logger.js`);
const codeRepository = require(`${basePath}/repository/codeRepository.js`);
const db = require(`${basePath}/config/database.js`);

/**
 * 코드목록 조회(view)
 * @param {object} params 
 * @returns 
 */
exports.getViewCodeList = params => codeRepository.selectViewCodeList(params)

/**
 * 코드목록 조회
 * @param {object} param 
 * @returns 
 */
exports.getCodeList = async params => {
    return Promise.all([
        codeRepository.selectCodeCount(params),
        codeRepository.selectCodeList(params)
    ]).then(values => {
        params.paging.totalCount = Number(values[0].totalCount);
        return {list: values[1], params}
    }).catch(async error => {
        logger.error('getCodeList ERROR ::', error);
        return Promise.reject(error);
    });
}

/**
 * 코드 등록/수정/삭제 적용
 * @param {*} param 
 */
exports.applyCode = async (params) => {
    
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
        cnts.insertCnt > 0 ? await codeRepository.insertCodeList({insertList, userNo}, conn) : null,
        cnts.updateCnt > 0 ? await codeRepository.updateCodeList({updateList, userNo}, conn) : null,
        cnts.deleteCnt > 0 ? await codeRepository.deleteCodeList({deleteList, userNo}, conn) : null
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
        logger.error('applyCode ERROR ::', error);
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