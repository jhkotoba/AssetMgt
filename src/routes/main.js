const path = require("path");
const express = require("express");
const router = express.Router();

router.get("/", async (request, response) => {

    console.log('request.sessionID ::', request.sessionID);
    console.log('request.session.key ::', request.session.key);

    response.sendFile(path.join (__dirname , "../public/page/index.html"));
});

module.exports = router;
