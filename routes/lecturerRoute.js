const express = require("express");
const lecturerController = require("../controllers/lecturerController");
const lecturerRouter = express.Router();

lecturerRouter.use((req, res, next) => {
    switch (req.url) {
        case "/":
            return next();
        case "/new_lecturer":
            return next();
        default:
            if (RegExp(/\/update_lecturer_id\=([0-9]+)/).test(req.url)) {
                return next();
            }
            return res.status(404).send("Страница не найдена");
    }
});

lecturerRouter.get("/", lecturerController.index);

lecturerRouter.get("/new_lecturer", lecturerController.new_lecturer);

lecturerRouter.get("/update_lecturer_id=*", lecturerController.update_lecturer);

module.exports = lecturerRouter;