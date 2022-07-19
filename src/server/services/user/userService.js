const crypto = require('crypto');
const jsencrypt = require(`nodejs-jsencrypt`);
const userRepository = require(`${basePath}/repository/user/userRepository.js`);
const validation = require(`${basePath}/util/validation.js`);

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
 * 회원정보 조회
 * @param {string} userId 
 * @returns 
 */
exports.getUser = userId => userRepository.selectUser(userId);

/**
 * 회원등록
 * @param {object} user 
 * @returns 
 */
exports.joinUser = user => {
    return new Promise((resolve, reject) => insertUserValidation(resolve, reject, user))
    .then(user => {

        // 암호 솔트 생성
        const salt = crypto.randomBytes(32).toString('base64');
        user.salt = salt;

        // 비밀번호 단반향 암호화
        user.password = crypto.pbkdf2Sync(user.password, salt, 54297, 192, 'sha512').toString('base64');

        return user;
    })
    .then(user => userRepository.insertUser(user));
}

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