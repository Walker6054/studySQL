const express = require("express");
const groupController = require("../controllers/groupController");
const groupRouter = express.Router();

groupRouter.use((req, res, next) => {
    switch (req.url) {
        case "/":
            return next();
        default:
            if (RegExp(/\/tests_update_id\=([0-9]+)/).test(req.url) || RegExp(/\/tests_results_id\=([0-9]+)/).test(req.url)) {
                return next();
            }
            return res.redirect("/404");
    }
});

groupRouter.get("/", groupController.index);

groupRouter.get("/tests_update_id=*", groupController.tests_update);

groupRouter.get("/tests_results_id=*", groupController.tests_results);

module.exports = groupRouter;

