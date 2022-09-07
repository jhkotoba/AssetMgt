const menuService = require(`${basePath}/services/system/menuService.js`);

// 로그인 처리
exports.getMenuList = async (request, response, next) => {

    console.log('=============== systemController getMenuList ===============');
    
    let menuList = await menuService.getMenuList();
    response.status(200).json({message: 'SUCCESS', resultCode: 'SUCCESS', data: menuList});
}