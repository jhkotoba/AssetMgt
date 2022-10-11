const express = require("express");
const router = express.Router();
const model = require(`${basePath}/config/model.js`);

router.get("/", async (request, response) => response.send(await model.modelAndView('main/main.html')));

module.exports = router;


