exports.getAccountList = async (request, response, next) => {

    let user = request.session.user;
    console.log('user:', user);

    response.status(200).json({
        message: 'SUCCESS',
        resultCode: 'SUCCESS',
        data: 'OK'
    });
}