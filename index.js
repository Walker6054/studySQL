const path = require('path');
const express = require("express");
//создаем прилодение
const app = express();

//маршруты
const mainRouter = require("./routes/mainRoute");
const apiRouter = require("./routes/apiRoute");
const regRouter = require("./routes/regRoute");
const testRouter = require("./routes/testRoute");
const groupRouter = require("./routes/groupRoute");
const studentRouter = require("./routes/studentRoute");
const lecturerRouter = require("./routes/lecturerRoute");

//проверка на подключение к бд, перенаправление на страницу с ошибкой
let connection = require("./models/.connectDB.js");
app.use(async (req, res, next) => {
    if (req.originalUrl.includes("static")) {
        return next();
    }
    let error_to_connect_db = false;
    await connection.getConnection()
        .then((connection) => {
            connection.release();
        })
        .catch((err) => {
            error_to_connect_db = true;
        });
    if (error_to_connect_db && req.url != "/error_db") {
        return res.redirect("/error_db");
    }
    if (!error_to_connect_db && req.url == "/error_db") {
        return res.redirect("/");
    }
    next();
});
 
//инициализация начальных путей маршрутов для дальйнешей обработки
app.use("/api", apiRouter);
app.use("/registration", regRouter);
app.use("/tests", testRouter);
app.use("/groups", groupRouter);
app.use("/students", studentRouter);
app.use("/lecturers", lecturerRouter);
app.use("/", mainRouter);

//использование директории на сервере
app.use('/static', express.static(path.join(__dirname, '/static')));

//шаблонизатор
const expressHbs = require('express-handlebars');

//устанавливаем настройки для файлов layout (шаблонизатор)
const hbs = expressHbs.create({
    layoutsDir: 'views/layouts',
    defaultLayout: 'layout',
    extname: 'hbs',
    partialsDir: 'views/components'
})
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

//запуск приложения
let port = process.env.PORT || 80;
app.listen(port);









// //инициализация админ панели
// const adm = require("express-admin");
// let config = {
//     dpath: './config/',
//     config: require("./config/config.json"),
//     settings: require("./config/settings.json"),
//     custom: require('./config/custom.json'),
//     users: require('./config/users.json')
// };
// adm.init(config, function (err, admin) {
//     if (err) return console.log(err);
//     const parser = express.json();
//     app.use('/admin', admin);
//     app.use(parser);
// });