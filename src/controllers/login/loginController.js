const pool = require('../../config/database.js');

// 로그인 처리
exports.loginProcess = async (request, response, next) => {
    
    request.session.key = "test";

    // TESE QUERY
    let conn = await pool.getConnection();
    var rows = await conn.query("SELECT * FROM MENU");
    for (i = 0, len = rows.length; i < len; i++) {
        console.log("Total connections: ", pool.totalConnections());
        console.log("Active connections: ", pool.activeConnections());
        console.log("Idle connections: ", pool.idleConnections());
        console.log(`rows:`, rows);
    }
    
   
    return response.json('ok');
}