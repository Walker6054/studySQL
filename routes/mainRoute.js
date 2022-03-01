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
    }
    return res.status(404).send("Страница не найдена");
});

mainRouter.get("/", mainController.index);

mainRouter.get("/login", mainController.login);

mainRouter.get("/lk", mainController.lk);

module.exports = mainRouter;