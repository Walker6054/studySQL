const express = require("express");
const studentController = require("../controllers/studentController");
const studentRouter = express.Router();

studentRouter.get("/", studentController.index);

studentRouter.get("/new_student", studentController.new_student);

studentRouter.get("/update_student_id=*", studentController.update_student);

module.exports = studentRouter;