const path = require('path');
const pathDir = path.dirname(__dirname);
const groups = require("../models/groups");

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
                    page: "regStudent",
                    view: false
                }
            );
        })
        .catch((err) => {
            console.log(err);
            response.status(200).send("Ошибка");
        })
}

exports.regLecturer = (request, response) => {
    response.render(pathDir + "/views/registration/regLecturer.hbs",
        {
            title: "Регистрация преподаватель",
            page: "regLecturer",
            view: false
        }
    );
}

exports.forgotPass = (request, response) => {
    response.render(pathDir + "/views/registration/forgotPass.hbs",
        {
            title: "Восстановление пароля",
            page: "forgotPass",
            view: false
        }
    );
}