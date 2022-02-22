const path = require('path');
const express = require("express");
//импортируем приложение
const app = express();

//маршруты
const mainRouter = require("./routes/mainRoute");
const apiRouter = require("./routes/apiRoute");
const regRouter = require("./routes/regRoute");
const testRouter = require("./routes/testRoute");
const groupRouter = require("./routes/groupRoute");

//шаблонизатор
const expressHbs = require('express-handlebars');
 
//инициализация начальных путей маршрутов для дальйнешей обработки
app.use("/", mainRouter);
app.use("/api", apiRouter);
app.use("/registration", regRouter);
app.use("/tests", testRouter);
app.use("/groups", groupRouter);


//Обработка ошибок
app.use((err, req, res, next) => {
    console.log(err);
    console.log(req);
    console.log(res);
    res.status(404).send("Произошла ошибка! Перезагрузике страницу");
});

//запуск приложения
app.listen(3000);

//использование директории на сервере
app.use('/static', express.static(path.join(__dirname, '/static')));
app.use('/views', express.static(path.join(__dirname, '/views')));


// устанавливаем настройки для файлов layout
app.engine(
    'hbs',
    expressHbs.engine({
        layoutsDir: 'views/layouts',
        defaultLayout: 'layout',
        extname: 'hbs',
        partialsDir: 'views/components'
    })
)
app.set('view engine', 'hbs');



//инициализация админ панели
const adm = require("express-admin");
let config = {
    dpath: './config/',
    config: require("./config/config.json"),
    settings: require("./config/settings.json"),
    custom: require('./config/custom.json'),
    users: require('./config/users.json')
};
adm.init(config, function (err, admin) {
    if (err) return console.log(err);
    const parser = express.json();
    app.use('/admin', admin);
    app.use(parser);
});