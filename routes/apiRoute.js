const express = require("express");
const apiController = require("../controllers/apiController");
const mainController = require("../controllers/mainController");
const apiRouter = express.Router();

const parser = express.json();
apiRouter.use(parser);

apiRouter.post("/api-reguser", parser, apiController.reguser);

apiRouter.post("/api-loguser", parser, apiController.loguser);

module.exports = apiRouter;