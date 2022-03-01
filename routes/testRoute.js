const express = require("express");
const testController = require("../controllers/testController");
const testRouter = express.Router();

testRouter.use((req, res, next) => {
    switch (req.url) {
        case "/":
            return next();
        case "/new_test":
            return next();
        default:
            if (RegExp(/\/update_testID\=([0-9]+)/).test(req.url) || RegExp(/\/solve_testID\=([0-9]+)/).test(req.url)) {
                return next();
            }
            return res.status(404).send("Страница не найдена");
    }
});

testRouter.get("/", testController.index);

testRouter.get("/new_test", testController.new_test);

testRouter.get("/update_testID(=)?*", testController.update_test);

testRouter.get("/solve_testID(=)?*", testController.solve_test);

module.exports = testRouter;