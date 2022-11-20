const express = require("express");
const router = express.Router();
const model = require(`${basePath}/config/model.js`);
//const accountController = require(`${basePath}/controllers/account/accountController.js`)

// 계좌관리 페이지
router.get("/account", async (request, response) => response.send(await model.modelAndView('account/account.html')));

// 계좌내역 페이지
router.get("/record", async (request, response) => response.send(await model.modelAndView('account/record.html')));

module.exports = router;