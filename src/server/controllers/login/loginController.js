const userService = require(`${basePath}/services/user/userService.js`);
const jsencrypt = require(`nodejs-jsencrypt`);
const validation = require(`${basePath}/util/validation.js`);

// 로그인 처리
exports.loginProcess = async (request, response, next) => {
        
    let user = await userService.isUser(request.body);
    let result = {};

    if(user){

    }else{

    }
    
    return response.json(result);
}

/**
 * 회원가입 처리
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
exports.joinProcess = async (request, response, next) => {

    // 복호화 객체 생성
    const crypt = new jsencrypt.JSEncrypt();
    crypt.setPrivateKey(process.env.AES256_PRIVATE_KEY);
    
    // 회원 아이디
    let userId = request.body.userId;
    // 회원 비밀번호
    let password = crypt.decrypt(request.body.password);
    // 회원 이메일
    let email = crypt.decrypt(request.body.email);

    // 회원등록
    userService.joinUser({userId, password, email}).then(value => {
        // 회원등록 성공 응답 처리
        response.status(200).json({message: '회원가입이 처리되었습니다.', resultCode: 'SUCCESS'});

    // 회원등록 예외 및 오류
    }).catch(error => {
        console.error(error);
        switch(error.resultCode){
            case 'ALREADY_EXISTS_ID': 
                response.status(200).json({resultCode: error.resultCode, message: '이미 존재하는 아이디 입니다.'});
            break;
            case 'EMPTY_PARAMETER': 
                response.status(200).json({resultCode: error.resultCode, message: '입력값이 누락되었습니다.'});
            break;
            case 'NOT_EMAIL_FORMAT': 
                response.status(200).json({resultCode: error.resultCode, message: '이메일 형식이 올바르지 않습니다.'});
            break;
            case 'INSERT_FAIL':
                response.status(200).json({resultCode: error.resultCode, message: '저장에 실패하였습니다.'});
            break;
            default:
                response.status(500).json({resultCode: 'SYSTEM_ERROR', message: '시스템 오류가 발생하였습니다.'});
            break;
        }
    });
}