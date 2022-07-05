const express = require("express");
const router = express.Router();
const loginController = require(`${basePath}/controllers/login/loginController.js`)

// 로그인 페이지
router.get("/", async (request, response) => response.sendFile(`${public}/view/login/login.html`));

// 로그인 처리
router.post("/loginProcess", loginController.loginProcess);

module.exports = router;