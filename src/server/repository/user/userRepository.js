const repository = require(`${basePath}/config/repository.js`);

/**
 * 회원정보 조회
 * @param {string} userId 
 * @returns 
 */
exports.selectUser = async (userId, conn) => {
    
    // 회원정보 조회 쿼리
    return await repository.selectOne(
        `/* userRepository.selectUser */
        SELECT
            USER_NO     AS userNo
            , USER_ID   AS userId
            , PASSWORD  AS password
            , SALT      AS salt
            , EMAIL     AS email
        FROM UR_USER
        WHERE 1=1
        AND USER_ID = '${userId}'
        LIMIT 1`, conn);
}

/**
 * 회원등록
 * @param {*} user 
 * @returns 
 */
exports.insertUser = async (user, conn) => {

    // 회원등록
    return await repository.insert(
        `INSERT INTO UR_USER (
            USER_ID
            , PASSWORD
            , SALT
            , EMAIL
            , USE_YN
            , INS_NO
            , INS_DTTM
            , UPT_NO
            , UPT_DTTM
        ) VALUES (
            '${user.userId}'
            , '${user.password}'
            , '${user.salt}'
            , '${user.email}'
            , 'Y'
            , 0
            , NOW()
            , 0
            , NOW()
        )`
    , conn);
}
