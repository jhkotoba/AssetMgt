const express = require("express");
const router = express.Router();
const model = require(`${basePath}/config/model.js`);
const accountController = require(`${basePath}/controllers/accountController.js`)

// 계좌목록 페이지
router.get("/accountList", async (request, response) => response.send(await model.modelAndView('account/accountList.html', {request, code:['GRP_CD_BANK', 'GRP_CD_ACCT_TYPE']})));

// 계좌상세 팝업
router.get("/accountDetail", async (request, response) => response.send(await model.modelAndPopup('account/accountDetail.html', {request, code:['GRP_CD_BANK', 'GRP_CD_ACCT_TYPE']})));

// 계좌내역 페이지
router.get("/record", async (request, response) => response.send(await model.modelAndView('account/record.html', {request})));

// 계좌목록 조회
router.post("/getAccountList", accountController.getAccountList);

// 메뉴목록 적용
router.post("/applyAccount", accountController.applyAccount);

module.exports = router;