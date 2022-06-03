const express = require("express");
const studentController = require("../controllers/studentController");
const studentRouter = express.Router();

studentRouter.use((req, res, next) => {
    if (req.url[req.url.length-1] == "/" && req.url.length != 1) {
        req.url = req.url.substring(0, req.url.length - 1);
    }
    switch (req.url) {
        case "/":
            return next();
        case "/new_student":
            return next();
        default:
            if (RegExp(/\/\?id\=([0-9]+)/).test(req.url)) {
                return next();
            }
            if (RegExp(/\/update_student\?id\=([0-9]+)/).test(req.url)) {
                return next();
            }
            return res.redirect("/404");
    }
});

studentRouter.get("/", studentController.index);

studentRouter.get("/new_student", studentController.new_student);

studentRouter.get("/update_student", studentController.update_student);

module.exports = studentRouter;