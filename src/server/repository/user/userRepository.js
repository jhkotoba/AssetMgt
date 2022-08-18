const pool = require(`${basePath}/config/database.js`);

/**
 * 회원정보 조회
 * @param {string} userId 
 * @returns 
 */
exports.selectUser = async (userId, conn) => {
    
    let query = 
        `SELECT
            USER_NO     AS userNo
            , USER_ID   AS userId
            , PASSWORD  AS password
            , SALT      AS salt
            , EMAIL     AS email
        FROM UR_USER
        WHERE 1=1
        AND USER_ID = '${userId}'
        LIMIT 1
        `;

    if(conn){
        let result = await conn.query(query);
        return result[0];
    }else{
        let connection = await pool.getConnection();
        let result = await connection.query(query);
        connection.release();
        connection.commit();
        return result[0];
    }
}

/**
 * 회원등록
 * @param {*} user 
 * @returns 
 */
exports.insertUser = async (user, conn) => {

    let query = 
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
        )`;

    if(conn){
        console.log('--------conn');
        let result = await conn.query(query);
        return result;
    }else{
        console.log('--------connection');
        let connection = await pool.getConnection();
        let result = await connection.query(query);
        connection.release();
        connection.commit();
        return result;
    }

    // let conn = await pool.getConnection();
    // let result = await conn.query(
    //     `INSERT INTO UR_USER (
    //         USER_ID
    //         , PASSWORD
    //         , SALT
    //         , EMAIL
    //         , USE_YN
    //         , INS_NO
    //         , INS_DTTM
    //         , UPT_NO
    //         , UPT_DTTM
    //     ) VALUES (
    //         '${user.userId}'
    //         , '${user.password}'
    //         , '${user.salt}'
    //         , '${user.email}'
    //         , 'Y'
    //         , 0
    //         , NOW()
    //         , 0
    //         , NOW()
    //     )`
    // );
    // conn.release();
    // return result;
}


/**
 * 회원등록
 * @param {*} user 
 * @returns 
 */
 exports.insertUser_test = async (user, conn) => {    
    //let conn = await pool.getConnection();
    let result = await conn.query(
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
    );
    //conn.release();
    return result;
}
