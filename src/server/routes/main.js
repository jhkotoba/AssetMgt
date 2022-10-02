const express = require("express");
const router = express.Router();
const model = require(`${basePath}/config/model.js`);

router.get("/", (request, response) => response.send(model.modelAndView('/main/main.html')));

module.exports = router;


