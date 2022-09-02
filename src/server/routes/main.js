const express = require("express");
const router = express.Router();

router.get("/", async (request, response) => response.sendFile(`${public}/view/main/main.html`));

module.exports = router;
