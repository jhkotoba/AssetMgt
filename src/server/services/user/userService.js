const jsencrypt = require(`nodejs-jsencrypt`);
const userRepository = require(`${basePath}/repository/user/userRepository.js`);

exports.getUser = async (params) => {

    // 복호화 객체 생성
    const crypt = new jsencrypt.JSEncrypt();
    crypt.setPrivateKey(process.env.AES256_PRIVATE_KEY);

    // 회원정보 조회
    return await userRepository.selectUser(crypt.decrypt(params.userId));
}