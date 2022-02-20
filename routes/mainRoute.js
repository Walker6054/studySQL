const express = require("express");
const mainController = require("../controllers/mainController");
const mainRouter = express.Router();

mainRouter.get("/", mainController.index);

mainRouter.get("/login", mainController.login);

mainRouter.get("/group_test", mainController.group_test);

mainRouter.get("/result_tests", mainController.result_tests);

module.exports = mainRouter;