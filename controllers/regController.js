const path = require('path');
const pathDir = path.dirname(__dirname);
const groups = require("../models/tables/groups");

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
    response.render(pathDir + "/views/registration/recoveryPass.hbs",
        {
            title: "Восстановление пароля",
            page: "login/recoveryPass",
            view: false
        }
    );
}