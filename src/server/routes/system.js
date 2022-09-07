const express = require("express");
const router = express.Router();
const systemController = require(`${basePath}/controllers/system/systemController.js`)

// 메뉴목록 조회
router.post("/getMenuList", systemController.getMenuList);

module.exports = router;
