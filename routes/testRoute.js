const express = require("express");
const testController = require("../controllers/testController");
const testRouter = express.Router();

testRouter.get("/", testController.index);

testRouter.get("/new_test", testController.new_test);

testRouter.get("/update_testID(=)?*", testController.update_test);

testRouter.get("/group_test", testController.group_test);

testRouter.get("/result_tests", testController.result_tests);

module.exports = testRouter;