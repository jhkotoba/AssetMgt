/**
 * μΈμνν°
 * @param {*} requset 
 * @param {*} response 
 * @param {*} next 
 */
const sessionFilter = (requset, response, next) => {
    if(requset.session.user || requset.path.indexOf('/login') > -1 || requset.path.indexOf('/join') > -1){
        next();
    }else{
        response.redirect('/login');
    }
}
module.exports = sessionFilter;