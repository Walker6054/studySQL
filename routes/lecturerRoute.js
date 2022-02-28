const express = require("express");
const lecturerController = require("../controllers/lecturerController");
const lecturerRoute = express.Router();

lecturerRoute.get("/", lecturerController.index);

lecturerRoute.get("/new_lecturer", lecturerController.new_lecturer);

lecturerRoute.get("/update_lecturer_id=*", lecturerController.update_lecturer);

module.exports = lecturerRoute;