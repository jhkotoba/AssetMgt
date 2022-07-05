const userService = require(`${basePath}/services/user/userService.js`);

// 로그인 처리
exports.loginProcess = async (request, response, next) => {
    
    let user = await userService.getUser('leedev');
    console.log('user:', user);    
   
    return response.json('ok');
}