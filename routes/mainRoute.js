const express = require("express");
const mainController = require("../controllers/mainController");
const mainRouter = express.Router();

mainRouter.get("/", mainController.index);

module.exports = mainRouter;