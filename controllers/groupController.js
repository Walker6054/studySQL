const path = require('path');
const pathDir = path.dirname(__dirname);
const jwt = require("jsonwebtoken");

const users = require("../models/users");
const students = require("../models/students");
const lecturers = require("../models/lecturers");
const admin = require("../models/admin");
const get_data = require("../models/get_data");
const groups = require("../models/groups");


exports.index = async (request, response) => {
    let verify = await get_cookie_check_user(request.rawHeaders);
    console.log(verify);

    //инициализация пути
    let breadcrumb = Array();
    breadcrumb.push({ title: "Главная", href: "", active: false });
    breadcrumb.push({ title: "Группы", href: "/groups", active: true });

    let groups_list;
    if (verify[0]) {
        switch (verify[1]) {
            case "student":
                response.redirect("/");
                break;
            
            case "lecturer":
                await get_data.get_lecturers_groups(verify[0].login)
                    .then((res) => {
                        groups_list = res[0][0];
                        console.log(res);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                
                response.render(pathDir + "/views/groups/groups.hbs",
                    {
                        title: "Основы SQL",
                        headPage: 'Образовательная система "Основы SQL"',
                        userName: verify[0].login,
                        page: "groups/groups",
                        viewHeader: true,
                        lecturer: true,
                        breadcrumb: breadcrumb,
                        groups: groups_list
                    }
                );
                break;
            case "admin":
                await groups.allGroups()
                    .then((res) => {
                        groups_list = res[0];
                        console.log(res);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                
                response.render(pathDir + "/views/groups/groups.hbs",
                    {
                        title: "Основы SQL",
                        headPage: 'Образовательная система "Основы SQL"',
                        userName: verify[0].login,
                        page: "groups/groups",
                        viewHeader: true,
                        admin: true,
                        breadcrumb: breadcrumb,
                        groups: groups_list
                    }
                );
                break;
        }

    } else {
        response.redirect("/login");
    }
};

exports.tests_update = async (request, response) => {
    let id_group = request.url.split("=")[1];
    let verify = await get_cookie_check_user(request.rawHeaders);

    //инициализация пути
    let breadcrumb = Array();
    breadcrumb.push({ title: "Главная", href: "", active: false });
    breadcrumb.push({ title: "Группы", href: "/groups", active: false });
    breadcrumb.push({ title: "Прикрепленные тесты", href: "/tests_update", active: true });

    let tests;
    let group_shifr;
    await groups.groups(id_group)
        .then((res) => {
            group_shifr = res[0][0].shifr;
        })
        .catch((err) => {
            console.log(err);
        })
    
    if (verify[0]) {
        switch (verify[1]) {
            case "student":
                response.redirect("/");
                break;
            
            case "lecturer":
                await get_data.get_group_tests(verify[0].login, id_group)
                    .then((res) => {
                        tests = res[0][0];
                        console.log(res);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                
                response.render(pathDir + "/views/groups/tests_update.hbs",
                    {
                        title: "Основы SQL",
                        headPage: 'Образовательная система "Основы SQL"',
                        userName: verify[0].login,
                        page: "groups/tests_update",
                        viewHeader: true,
                        lecturer: true,
                        breadcrumb: breadcrumb,
                        tests: tests,
                        group: group_shifr
                    }
                );
                break;
            case "admin":
                await get_data.get_groups_tests(id_group)
                    .then((res) => {
                        tests = res[0][0];
                        console.log(res);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                response.render(pathDir + "/views/groups/tests_update.hbs",
                    {
                        title: "Основы SQL",
                        headPage: 'Образовательная система "Основы SQL"',
                        userName: verify[0].login,
                        page: "groups/tests_update",
                        viewHeader: true,
                        admin: true,
                        breadcrumb: breadcrumb,
                        tests: tests,
                        group: group_shifr
                    }
                );
                break;
        }

    } else {
        response.redirect("/login");
    }
};

exports.tests_results = async (request, response) => {
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
                response.render(pathDir + "/views/tests/result_tests.hbs",
                    {
                        title: "Основы SQL",
                        headPage: 'Образовательная система "Основы SQL"',
                        userName: verify[0].login,
                        page: "tests/result_tests",
                        viewHeader: true,
                        lecturer: true,
                        breadcrumb: breadcrumb
                    }
                );
                break;
            case "admin":
                response.render(pathDir + "/views/tests/result_tests.hbs",
                    {
                        title: "Основы SQL",
                        headPage: 'Образовательная система "Основы SQL"',
                        userName: verify[0].login,
                        page: "tests/result_tests",
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
        
        try {
            user_checked[0] = jwt.verify(token, userDB.idusers.toString());
        } catch {
            user_checked[0] = false;
        }
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