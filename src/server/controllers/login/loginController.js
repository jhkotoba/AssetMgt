const userService = require(`${basePath}/services/user/userService.js`);

// 로그인 처리
exports.loginProcess = async (request, response, next) => {
        
    let user = await userService.isUser(request.body);
    let result = {};

    if(user){

    }else{

    }
    
    return response.json(result);
}

// 회원가입 처리
exports.joinProcess = async (request, response, next) => {

    userService.isUser(request.body).then(isUser => {
        if(isUser < 0){

        }else{
            return Promise.reject({resultCode: 'ALREADY_EXISTS_ID'});
        }

        response.status(200).json({message: '회원가입이 처리되었습니다.', resultCode: 'SUCCESS'});

    }).catch(error => {        
        switch(error.resultCode){
            case 'ALREADY_EXISTS_ID': 
                response.status(200).json({resultCode: error.resultCode, message: '이미 존재하는 아이디 입니다.'});
            break;
            default:
                response.status(500).json(error);
            break;
        }
    });
}