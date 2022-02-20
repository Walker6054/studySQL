const path = require('path');
const pathDir = path.dirname(__dirname);
const jwt = require("jsonwebtoken");

const users = require("../models/users");
const get_data = require("../models/get_data");

exports.login = async (request, response) => {
    let verify = await get_cookie_check_user(request.rawHeaders);

    if (verify[0]) {
        response.redirect("/");
    } else {
        response.render(pathDir + "/views/login.hbs",
            {
                title: "Основы SQL",
                page: "login/login",
                view: false
            }
        );
    }
}

exports.index = async (request, response) => {
    let verify = await get_cookie_check_user(request.rawHeaders);

    if (verify[0]) {
        let flagUser = Array();
        switch (verify[1]) {
            case "student":
                flagUser[0] = true;
                break;
            case "lecturer":
                flagUser[1] = true;
                break;
            case "admin":
                flagUser[2] = true;
                break;
        }

        //инициализация пути
        let breadcrumb = Array();
        breadcrumb.push({ title: "Главная", href: "/", active: "active" });

        response.render(pathDir + "/views/main.hbs",
            {
                title: "Основы SQL",
                headPage: 'Образовательная система "Основы SQL"',
                userName: verify[0].login,
                page: "main",
                viewHeader: true,
                student: flagUser[0],
                lecturer: flagUser[1],
                admin: flagUser[2],
                breadcrumb: breadcrumb
            }
        );
    } else {
        response.redirect("/login");
    }
};

exports.group_test = async (request, response) => {
    let verify = await get_cookie_check_user(request.rawHeaders);

    //инициализация пути
    let breadcrumb = Array();
    breadcrumb.push({ title: "Главная", href: "", active: false });
    breadcrumb.push({ title: "Тесты прикрепленные к группам", href: "group_test", active: true });

    if (verify[0]) {
        switch (verify[1]) {
            case "student":
                response.redirect("/tests");
                break;
            
            case "lecturer":
                response.render(pathDir + "/views/group_test.hbs",
                    {
                        title: "Основы SQL",
                        headPage: 'Образовательная система "Основы SQL"',
                        userName: verify[0].login,
                        page: "group_test",
                        viewHeader: true,
                        lecturer: true,
                        breadcrumb: breadcrumb
                    }
                );
                break;
            case "admin":
                response.render(pathDir + "/views/group_test.hbs",
                    {
                        title: "Основы SQL",
                        headPage: 'Образовательная система "Основы SQL"',
                        userName: verify[0].login,
                        page: "group_test",
                        viewHeader: true,
                        admin: true,
                        breadcrumb: breadcrumb
                    }
                );
                break;
        }

    } else {
        response.redirect("/login");
    }
};

exports.result_tests = async (request, response) => {
    let verify = await get_cookie_check_user(request.rawHeaders);

    //инициализация пути
    let breadcrumb = Array();
    breadcrumb.push({ title: "Главная", href: "", active: false });
    breadcrumb.push({ title: "Результаты групп по прохождению тестов", href: "/result_tests", active: true });

    if (verify[0]) {
        switch (verify[1]) {
            case "student":
                response.redirect("/tests");
                break;
            
            case "lecturer":
                response.render(pathDir + "/views/result_tests.hbs",
                    {
                        title: "Основы SQL",
                        headPage: 'Образовательная система "Основы SQL"',
                        userName: verify[0].login,
                        page: "result_tests",
                        viewHeader: true,
                        lecturer: true,
                        breadcrumb: breadcrumb
                    }
                );
                break;
            case "admin":
                response.render(pathDir + "/views/result_tests.hbs",
                    {
                        title: "Основы SQL",
                        headPage: 'Образовательная система "Основы SQL"',
                        userName: verify[0].login,
                        page: "result_tests",
                        viewHeader: true,
                        admin: true,
                        breadcrumb: breadcrumb
                    }
                );
                break;
        }

    } else {
        response.redirect("/login");
    }
};

async function get_cookie_check_user(req) {
    let cookiesString;
    for (let i = 0; i < req.length; i++){
        if (req[i] == "Cookie") {
            cookiesString = req[i + 1];
            break;
        }
    }
    let cookies = cookiesString.split("; ");
    let token = "";
    for (let i = 0; i < cookies.length; i++){
        if (cookies[i].split("=")[0] == "C0o1o2k3i4e5L6o7g8i9n10U11s12e13r14") {
            token = cookies[i].split("=")[1];
            break;
        }
    }

    let user_checked = Array();
    user_checked[0] = false;

    if ((token != "") && (token != "false")) {
        let user = jwt.decode(token);
        let userDB;
        await users.users(user.login)
            .then((res) => {
                userDB = res[0][0][0];
            })
            .catch((err) => {
                console.log(err);
            })
        user_checked[0] = jwt.verify(token, userDB.idusers.toString());

        await get_data.return_type_user(user.login)
            .then((res) => {
                user_checked[1] = Object.values(res[0][0])[0];
            })
            .catch((err) => {
                console.log(err);
            })
    }
    return user_checked;
}