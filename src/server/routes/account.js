const express = require("express");
const router = express.Router();
const model = require(`${basePath}/config/model.js`);
const accountController = require(`${basePath}/controllers/accountController.js`)

// 계좌관리 페이지
router.get("/account", async (request, response) => response.send(await model.modelAndView('account/account.html', {request})));

// 계좌내역 페이지
router.get("/record", async (request, response) => response.send(await model.modelAndView('account/record.html', {request})));

// 계좌목록 조회
router.post("/getAccountList", accountController.getAccountList);

module.exports = router;