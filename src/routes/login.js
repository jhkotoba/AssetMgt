const path = require("path");
const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login/loginController.js")

// 로그인 페이지
router.get("/", async (req, res) => res.sendFile(path.join (__dirname , "../public/page/login/login.html")));

// 로그인 처리
router.post("/loginProcess", loginController.loginProcess);

module.exports = router;