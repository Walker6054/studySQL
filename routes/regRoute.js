const express = require("express");
const regController = require("../controllers/regController");
const regRouter = express.Router();

regRouter.get("/", regController.index);

regRouter.get("/student", regController.regStudent);

regRouter.get("/lecturer", regController.regLecturer);

regRouter.get("/forgotPass", regController.forgotPass);

regRouter.get("/recoveryPass(=)?*", regController.recoveryPass);

module.exports = regRouter;