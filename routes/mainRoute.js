const express = require("express");
const mainController = require("../controllers/mainController");
const mainRouter = express.Router();

mainRouter.use((req, res, next) => {
    if (req.originalUrl.includes("static")) {
        return next();
    }
    switch (req.url) {
        case "/":
            return next();
        case "/login":
            return next();
        case "/lk":
            return next();
        case "/404":
            return next();
        case "/error_db":
            return next();
    }
    return res.redirect("/404");
});

mainRouter.get("/", mainController.index);

mainRouter.get("/login", mainController.login);

mainRouter.get("/lk", mainController.lk);

mainRouter.get("/404", mainController.error_404);

mainRouter.get("/error_db", mainController.error_db);

module.exports = mainRouter;