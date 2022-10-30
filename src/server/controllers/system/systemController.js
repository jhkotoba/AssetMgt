const menuService = require(`${basePath}/services/system/menuService.js`);

/**
 * 메뉴목록 조회
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
exports.getMenuList = async (request, response, next) => {

    // 메뉴목록 조회
    await menuService.getMenuList().then(value => {
        response.status(200).json({
            message: 'SUCCESS',
            resultCode: 'SUCCESS',
            data: value
        });
    }).catch(error => {

        // 로그아웃 처리
        request.session.destroy();

        // 예외 응답
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

/**
 * 메뉴정보 등록/수정/삭제 적용
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
exports.applyMenu = async (request, response, next) => {

    await menuService.applyMenu(request.body).then(result => {

        response.status(200).json({
            message: 'SUCCESS',
            resultCode: 'SUCCESS',
            data: result
        });
    }).catch(error => {
        // 예외 응답
        switch(error.message){        
        default:
            response.status(500).json({resultCode: 'SYSTEM_ERROR', message: `시스템 오류가 발생하였습니다. (${error.message})`});
        break;
        }
    });
}