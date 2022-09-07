/**
 * 세션필터
 * @param {*} requset 
 * @param {*} response 
 * @param {*} next 
 */
const sessionFilter = (requset, response, next) => {

    // 회원번호
    let userNo = requset.session.user ? requset.session.user.userNo : undefined;
    
    if(requset.path.indexOf('favicon.ico') > -1){
        console.log(`next >> ${requset.path}`);
        next();
    }else if(userNo == undefined){
        if(requset.path.indexOf('/login') > -1 || requset.path.indexOf('/join') > -1){
            console.log(`next >> ${requset.path}`);
            next();
        }else{
            console.log(`redirect >> ${requset.path}`);
            response.redirect('/login');
        }
    }else{
        if(requset.path === '/'){
            console.log(`next >> ${requset.path}`);
            next();
        }else if(requset.path.indexOf('/login') > -1 || requset.path.indexOf('/join') > -1){
            console.log(`redirect >> ${requset.path}`);
            response.redirect('/');
        }
    }
}
module.exports = sessionFilter;