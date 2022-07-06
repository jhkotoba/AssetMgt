const userService = require(`${basePath}/services/user/userService.js`);

// 로그인 처리
exports.loginProcess = async (request, response, next) => {
        
    let user = await userService.getUser(request.body);
    let result = {};

    if(user){

    }else{

    }
    
    return response.json(result);
}