const express = require("express");
const router = express.Router();
const model = require(`${basePath}/config/model.js`);
const systemController = require(`${basePath}/controllers/system/systemController.js`)

// 메뉴관리 페이지
router.get("/menu", async (request, response) => response.send(await model.modelAndView('system/menu.html')));

// 메뉴목록 조회
router.post("/getMenuList", systemController.getMenuList);

// 메뉴목록 적용
router.post("/applyMenu", systemController.applyMenu);

module.exports = router;
