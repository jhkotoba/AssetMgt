const menuService = require(`${basePath}/services/system/menuService.js`);

// 메뉴목록 조회
exports.getMenuList = async (request, response, next) => {

    // 메뉴목록 조회
    await menuService.getMenuList().then(value => {
        response.status(200).json({
            message: 'SUCCESS',
            resultCode: 'SUCCESS',
            data: value
        });
    }).catch(error => {
        switch(error.message){
            case 'NO_SEARCH_MENU':
                response.status(200).json({resultCode: error.message, message: `시스템 오류가 발생하였습니다. (${error.message})`});
            break;
            default:
                response.status(500).json({resultCode: 'SYSTEM_ERROR', message: `시스템 오류가 발생하였습니다. (${error.message})`});
            break;
        }
    });
}