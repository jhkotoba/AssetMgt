const crypto = require('crypto');
const jsencrypt = require(`nodejs-jsencrypt`);
const userRepository = require(`${basePath}/repository/user/userRepository.js`);

exports.isUser = async (params) => {

    // 복호화 객체 생성
    const crypt = new jsencrypt.JSEncrypt();
    crypt.setPrivateKey(process.env.AES256_PRIVATE_KEY);

    let userId = crypt.decrypt(params.userId);
    let password = crypt.decrypt(params.password);

    //const salt = crypto.randomBytes(32).toString('base64');

    // 회원정보 조회
    const user = await userRepository.selectUser(userId);
    const encryptPwd = crypto.pbkdf2Sync(password, user.salt, 54297, 192, 'sha512').toString('base64');

    if(encryptPwd === user.password){
        return user;
    }else{
        return null;
    }
}