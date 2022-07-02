const path = require("path");
const express = require("express");
const router = express.Router();

router.get("/", async (request, response) => {   
    response.sendFile(path.join (__dirname , "../public/page/index.html"));
});

module.exports = router;