const express = require("express");
const regController = require("../controllers/regController");
const regRouter = express.Router();

regRouter.use((req, res, next) => {
    if (req.url[req.url.length-1] == "/" && req.url.length != 1) {
        req.url = req.url.substring(0, req.url.length - 1);
    }
    switch (req.url) {
        case "/":
            return next();
        case "/student":
            return next();
        case "/lecturer":
            return next();
        case "/forgotPass":
            return next();
        default:
            if (RegExp(/\/recoveryPass\=([A-Za-z0-9\.]+)/).test(req.url)) {
                return next();
            }
            return res.redirect("/404");
    }
});

regRouter.get("/", regController.index);

regRouter.get("/student", regController.regStudent);

regRouter.get("/lecturer", regController.regLecturer);

regRouter.get("/forgotPass", regController.forgotPass);

regRouter.get("/recoveryPass(=)?*", regController.recoveryPass);

module.exports = regRouter;