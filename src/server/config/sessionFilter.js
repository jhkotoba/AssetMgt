/**
 * 세션필터
 * @param {*} requset 
 * @param {*} response 
 * @param {*} next 
 */
const sessionFilter = (requset, response, next) => {
    if(requset.path.indexOf('favicon.ico') > -1){
        next();
    }else if(requset.session.user || requset.path.indexOf('/login') > -1 || requset.path.indexOf('/join') > -1){
        next();
    }else{
        response.redirect('/login');
    }
}
module.exports = sessionFilter;