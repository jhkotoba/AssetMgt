const logger = require(`${basePath}/config/logger.js`);
const accountService = require(`${basePath}/services/accountService.js`);

exports.getAccountList = async (request, response, next) => {

    /**
     * 파라미터 세팅
     */
    // 회원번호
    let userNo = request.session.user.userNo;
    // 페이징 정보
    let paging = request.body.paging;

    // 계좌목록 조회
    await accountService.getAccountList({userNo, paging}).then(value => {
        response.status(200).json({
            message: 'SUCCESS',
            resultCode: 'SUCCESS',
            data: value
        });
    }).catch(error => {
        logger.error('getAccountList:', error);
        // 예외 응답
        switch(error.message){
            default:
                response.status(500).json({resultCode: 'SYSTEM_ERROR', message: `시스템 오류가 발생하였습니다.`});
            break;
        }
    });
}