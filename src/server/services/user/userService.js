const crypto = require('crypto');
const jsencrypt = require(`nodejs-jsencrypt`);
const userRepository = require(`${basePath}/repository/user/userRepository.js`);
const validation = require(`${basePath}/util/validation.js`);
const pool = require(`${basePath}/config/database.js`);

/**
 * 회원체크 조회
 * @param {object} params 
 * @returns 
 */
exports.isUser = async (params) => {

    // 복호화 객체 생성
    const crypt = new jsencrypt.JSEncrypt();
    crypt.setPrivateKey(process.env.AES256_PRIVATE_KEY);

    let userId = crypt.decrypt(params.userId);
    let password = crypt.decrypt(params.password);

    //const salt = crypto.randomBytes(32).toString('base64');

    // 회원정보 조회
    let user = await userRepository.selectUser(userId);
    const encryptPwd = crypto.pbkdf2Sync(password, user ? user.salt : '', 54297, 192, 'sha512').toString('base64');

    if(user ){

    }else{

    }

    return Promise.reject({resultCode: 'ALREADY_EXISTS_ID'});

    // if(!user){
    //     return -1;
    // }else if(encryptPwd === user.password){
    //     return 1;
    // }else{
    //     return 0;
    // }
}

/**
 * 회원아이디로 회원정보 조회
 * @param {string} userId 
 */
exports.getUser = userId => userRepository.selectUser(userId);

/**
 * 회원등록
 * @param {object} user 
 * @returns 
 */
 exports.joinUser = async user => {

    // DB연결
    let conn = await pool.getConnection();
    // 트렌젝션
    await conn.beginTransaction();

    return new Promise((resolve, reject) => insertUserValidation(resolve, reject, user))
    // 회원정보 등록여부 체크
    .then(async user => {

        // 회원 아이디로 회원정보 조회
        let isUser = await userRepository.selectUser(user.userId);

        // 회원등록 여부 체크
        if(validation.isEmpty(isUser)){
            return user;
        }else{
            return Promise.reject({resultCode: 'ALREADY_EXISTS_ID'});
        }
    // 비밀번호 암호화
    }).then(user => {

        // 암호 솔트 생성
        const salt = crypto.randomBytes(32).toString('base64');
        user.salt = salt;

        // 비밀번호 단반향 암호화
        user.password = crypto.pbkdf2Sync(user.password, salt, 54297, 192, 'sha512').toString('base64');
        return user;

    // 회원등록
    }).then(async user => {

        // 회원등록
        let row = await userRepository.insertUser(user, conn);

        // 저장체크
        if(row.affectedRows < 1){
            return Promise.reject({resultCode: 'INSERT_FAIL'});
        }else{
            // 커밋
            conn.commit();
            return row;
        }

    // 오류발생 처리부분
    }).catch(err => {

        // 롤백
        conn.rollback();
        if(validation.isEmpty(err.resultCode)){
            // 오류
            return Promise.reject(err);
        }else{
            // 예외
            return Promise.reject({resultCode: err.resultCode, error: err.error});
        }
    
    // 로직 종료시 실행부분
    }).finally(() => {

        if(conn != null) {
            // 연결해제
            conn.release();
        }
    });
}


// exports.joinUser = user => {

//     return new Promise((resolve, reject) => insertUserValidation(resolve, reject, user))
//     .then(user => {

//         // 암호 솔트 생성
//         const salt = crypto.randomBytes(32).toString('base64');
//         user.salt = salt;

//         // 비밀번호 단반향 암호화
//         user.password = crypto.pbkdf2Sync(user.password, salt, 54297, 192, 'sha512').toString('base64');

//         return user;
//     })
//     .then(async user => {
//         let row = await userRepository.insertUser(user);
//         if(row < 1 || warningStatus !== 0){
//             return Promise.reject({resultCode: 'INSERT_FAIL'});
//         }else{
//             return row;
//         }
//     });
// }

/**
 * 사용자 유효성검사
 * @param {*} resolve 
 * @param {*} reject 
 * @param {*} user 
 */
function insertUserValidation(resolve, reject, user){

    // 빈값 체크
    for(let key in user){
        if(validation.isEmpty(user[key])){
            reject({resultCode: 'EMPTY_PARAMETER', data: user});
        }
    }

    // 이메일 체크
    if(validation.isEmail(user.email) === false){
        reject({resultCode: 'NOT_EMAIL_FORMAT', data: user});
    }

    resolve(user);
}