const path = require('path');
const pathDir = path.dirname(__dirname);
const groups = require("../models/tables/groups");
const jwt = require("jsonwebtoken");

exports.index = (request, response) => {
    response.redirect("/login");
}

exports.regStudent = (request, response) => {
    groups.allGroups()
        .then((res) => {
            let groups = res[0];
            response.render(pathDir + "/views/registration/regStudent.hbs",
                {
                    title: "Регистрация студент",
                    groups: groups,
                    page: "login/regStudent",
                    view: false
                }
            );
        })
        .catch((err) => {
            console.log(err);
            response.redirect("/login");
        })
}

exports.regLecturer = (request, response) => {
    response.render(pathDir + "/views/registration/regLecturer.hbs",
        {
            title: "Регистрация преподаватель",
            page: "login/regLecturer",
            view: false
        }
    );
}

exports.forgotPass = (request, response) => {
    response.render(pathDir + "/views/registration/forgotPass.hbs",
        {
            title: "Восстановление пароля",
            page: "login/forgotPass",
            view: false
        }
    );
}

exports.recoveryPass = (request, response) => {
    let token = request.url.split("=")[1];
    let user = jwt.decode(token);
    
    if (!user) {
        return response.status(404).send("Неверная ссылка");
    }

    let text = "Восстановление пароля";
    let not_wrong_time = true;
    if (Date.now() - user.date > 86400000) {
        text = "Истекло время ожидания ссылки";
        not_wrong_time = false;
    }

    response.render(pathDir + "/views/registration/recoveryPass.hbs",
        {
            title: "Восстановление пароля",
            page: "login/recoveryPass",
            view: false,
            text: text,
            not_wrong_time: not_wrong_time
        }
    );
}