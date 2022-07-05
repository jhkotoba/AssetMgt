const userRepository = require(`${basePath}/repository/user/userRepository.js`);

exports.getUser = async (userId) => {
    return await userRepository.selectUser(userId);
}