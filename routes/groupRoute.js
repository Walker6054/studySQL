const express = require("express");
const groupController = require("../controllers/groupController");
const groupRouter = express.Router();

groupRouter.use((req, res, next) => {
    if (req.url[req.url.length-1] == "/" && req.url.length != 1) {
        req.url = req.url.substring(0, req.url.length - 1);
    }
    switch (req.url) {
        case "/":
            return next();
        default:
            if (RegExp(/\/tests_update\?id\=([0-9]+)/).test(req.url) || RegExp(/\/tests_results\?id\=([0-9]+)/).test(req.url)) {
                return next();
            }
            return res.redirect("/404");
    }
});

groupRouter.get("/", groupController.index);

groupRouter.get("/tests_update", groupController.tests_update);

groupRouter.get("/tests_results", groupController.tests_results);

module.exports = groupRouter;

