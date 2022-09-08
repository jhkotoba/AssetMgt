const menuService = require(`${basePath}/services/system/menuService.js`);

// 메뉴목록 조회
exports.getMenuList = async (request, response, next) => {
    response.status(200).json({
        message: 'SUCCESS',
        resultCode: 'SUCCESS',
        data: await menuService.getMenuList()
    });
}