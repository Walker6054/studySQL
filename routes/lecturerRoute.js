const express = require("express");
const lecturerController = require("../controllers/lecturerController");
const lecturerRouter = express.Router();

lecturerRouter.use((req, res, next) => {
    if (req.url[req.url.length-1] == "/" && req.url.length != 1) {
        req.url = req.url.substring(0, req.url.length - 1);
    }
    switch (req.url) {
        case "/":
            return next();
        case "/new_lecturer":
            return next();
        default:
            if (RegExp(/\/update_lecturer_id\=([0-9]+)/).test(req.url)) {
                return next();
            }
            return res.redirect("/404");
    }
});

lecturerRouter.get("/", lecturerController.index);

lecturerRouter.get("/new_lecturer", lecturerController.new_lecturer);

lecturerRouter.get("/update_lecturer_id=*", lecturerController.update_lecturer);

module.exports = lecturerRouter;