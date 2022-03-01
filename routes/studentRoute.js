const express = require("express");
const studentController = require("../controllers/studentController");
const studentRouter = express.Router();

studentRouter.use((req, res, next) => {
    switch (req.url) {
        case "/":
            return next();
        case "/new_student":
            return next();
        default:
            if (RegExp(/\/update_student_id\=([0-9]+)/).test(req.url)) {
                return next();
            }
            return res.status(404).send("Страница не найдена");
    }
});

studentRouter.get("/", studentController.index);

studentRouter.get("/new_student", studentController.new_student);

studentRouter.get("/update_student_id=*", studentController.update_student);

module.exports = studentRouter;