const express = require("express");
const antlrController = require("../controllers/antrlController");
const antlrRoute = express.Router();

const parser = express.json();
antlrRoute.use(parser);

antlrRoute.use((req, res, next) => {
    if (req.url[req.url.length-1] == "/" && req.url.length != 1) {
        req.url = req.url.substring(0, req.url.length - 1);
    }
    switch (req.url) {
        case "/":
            return next();
        default:
            return res.redirect("/404");
    }
});

antlrRoute.get("/", antlrController.index);

antlrRoute.post("/", parser, antlrController.check_input_string);

module.exports = antlrRoute;

