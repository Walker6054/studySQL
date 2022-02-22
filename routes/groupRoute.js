const express = require("express");
const groupController = require("../controllers/groupController");
const groupRouter = express.Router();

groupRouter.get("/", groupController.index);

groupRouter.get("/tests_update_id=*", groupController.tests_update);

groupRouter.get("/tests_results_id=*", groupController.tests_results);

module.exports = groupRouter;

