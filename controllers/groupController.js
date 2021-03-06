const path = require('path');
const pathDir = path.dirname(__dirname);
const jwt = require("jsonwebtoken");

const hbs_helpers = require("../hbs_helpers/helpers");

const users = require("../models/users/users");
const get_data = require("../models/get_data");
const groups = require("../models/tables/groups");


exports.index = async (request, response) => {
    let verify = await get_cookie_check_user(request.rawHeaders);

    //инициализация пути
    let breadcrumb = Array();
    breadcrumb.push({ title: "Главная", href: "", active: false });
    breadcrumb.push({ title: "Группы", href: "/groups", active: true });

    if (!verify[0]) {
        return response.redirect("/login");
    }

    let groups_list;
    switch (verify[1]) {
        case "student":
            return response.redirect("/");
            break;
        
        case "lecturer":
            await get_data.get_lecturers_groups(verify[0].login)
                .then((res) => {
                    groups_list = res[0][0];
                })
                .catch((err) => {
                    console.log(err);
                });
            
            return response.render(pathDir + "/views/groups/groups.hbs",
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
                })
                .catch((err) => {
                    console.log(err);
                });
            
            return response.render(pathDir + "/views/groups/groups.hbs",
                {
                    title: "Основы SQL",
                    headPage: 'Образовательная система "Основы SQL"',
                    userName: verify[0].login,
                    page: "groups/groups_admin",
                    viewHeader: true,
                    admin: true,
                    breadcrumb: breadcrumb,
                    groups: groups_list
                }
            );
            break;
    }
};

exports.tests_update = async (request, response) => {
    let id_group = request.query.id;
    let verify = await get_cookie_check_user(request.rawHeaders);

    //инициализация пути
    let breadcrumb = Array();
    breadcrumb.push({ title: "Главная", href: "", active: false });
    breadcrumb.push({ title: "Группы", href: "/groups", active: false });
    breadcrumb.push({ title: "Прикрепленные тесты", href: "/tests_update", active: true });
    
    if (!verify[0]) {
        return response.redirect("/login");
    }

    let all_tests;
    let group_tests;
    let group_shifr;
    let add_enable = true;
    let not_exist_group = false;
    await groups.groups(id_group)
        .then((res) => {
            group_shifr = res[0][0].shifr;
        })
        .catch((err) => {
            not_exist_group = true;
            console.log(err);
        });

    switch (verify[1]) {
        case "student":
            return response.redirect("/");
            break;
        
        case "lecturer":
            if (not_exist_group) {
                return response.redirect("/groups/");
            }
            
            await get_data.get_group_tests(verify[0].login, id_group)
                .then((res) => {
                    group_tests = res[0][0];
                })
                .catch((err) => {
                    console.log(err);
                });
            
            await get_data.get_lecturer_tests(verify[0].login)
                .then((res) => {
                    all_tests = res[0][0];
                })
                .catch((err) => {
                    console.log(err);
                });
            
            //удаление повторов в массиве всех тестов (для ограничения добавления)
            for (let i = 0; i < group_tests.length; i++) {
                let index_entry = all_tests.findIndex(el => el.idtests == group_tests[i].idtests);
                if (index_entry != -1) {
                    all_tests.splice(index_entry, 1);
                }
            }

            if (all_tests.length == 0) {
                add_enable = false;
            }
            
            return response.render(pathDir + "/views/groups/tests_update.hbs",
                {
                    title: "Основы SQL",
                    headPage: 'Образовательная система "Основы SQL"',
                    userName: verify[0].login,
                    page: "groups/tests_update",
                    viewHeader: true,
                    lecturer: true,
                    breadcrumb: breadcrumb,
                    group_tests: group_tests,
                    all_tests: all_tests,
                    add_enable: add_enable,
                    group: group_shifr
                }
            );
            break;
        
        case "admin":
            if (not_exist_group) {
                return response.redirect("/groups/");
            }

            await get_data.get_groups_tests(id_group)
                .then((res) => {
                    group_tests = res[0][0];
                })
                .catch((err) => {
                    console.log(err);
                })
            await get_data.get_tests()
                .then((res) => {
                    all_tests = res[0][0];
                })
                .catch((err) => {
                    console.log(err);
                });
            
            //удаление повторов в массиве всех тестов (для ограничения добавления)
            for (let i = 0; i < group_tests.length; i++) {
                let index_entry = all_tests.findIndex(el => el.idtests == group_tests[i].idtests);
                if (index_entry != -1) {
                    all_tests.splice(index_entry, 1);
                }
            }

            if (all_tests.length == 0) {
                add_enable = false;
            }

            return response.render(pathDir + "/views/groups/tests_update.hbs",
                {
                    title: "Основы SQL",
                    headPage: 'Образовательная система "Основы SQL"',
                    userName: verify[0].login,
                    page: "groups/tests_update",
                    viewHeader: true,
                    admin: true,
                    breadcrumb: breadcrumb,
                    group_tests: group_tests,
                    all_tests: all_tests,
                    add_enable: add_enable,
                    group: group_shifr
                }
            );
            break;
    }
};

exports.tests_results = async (request, response) => {
    let id_group = request.query.id;
    let verify = await get_cookie_check_user(request.rawHeaders);

    //инициализация пути
    let breadcrumb = Array();
    breadcrumb.push({ title: "Главная", href: "", active: false });
    breadcrumb.push({ title: "Группы", href: "/groups", active: false });
    breadcrumb.push({ title: "Результаты выполнения тестов", href: "/tests_results", active: true });
    
    if (!verify[0]) {
        return response.redirect("/login");
    }

    let group_tests;
    let group_shifr;
    let not_exist_group = false;
    await groups.groups(id_group)
        .then((res) => {
            group_shifr = "Тестирование группы: " + res[0][0].shifr;
        })
        .catch((err) => {
            not_exist_group = true;
            console.log(err);
        });

    switch (verify[1]) {
        case "student":
            return response.redirect("/tests/");
            break;
        
        case "lecturer":
            if (not_exist_group) {
                return response.redirect("/groups/");
            }

            await get_data.get_group_tests(verify[0].login, id_group)
                .then((res) => {
                    group_tests = res[0][0];
                })
                .catch((err) => {
                    console.log(err);
                });
            for (let i = 0; i < group_tests.length; i++) {
                await get_data.get_result_group(verify[0].login, id_group, group_tests[i].idtests)
                    .then((res) => {
                        group_tests[i].results = res[0][0];
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            
            return response.render(pathDir + "/views/groups/tests_results.hbs",
                {
                    title: "Основы SQL",
                    headPage: 'Образовательная система "Основы SQL"',
                    userName: verify[0].login,
                    page: "groups/tests_results",
                    viewHeader: true,
                    lecturer: true,
                    breadcrumb: breadcrumb,
                    group: group_shifr,
                    group_tests: group_tests,
                    helpers: {
                        success_of_test: hbs_helpers.success_of_test
                    }
                }
            );
            break;
        
        case "admin":
            if (not_exist_group) {
                return response.redirect("/groups/");
            }

            await get_data.get_groups_tests(id_group)
                .then((res) => {
                    group_tests = res[0][0];
                })
                .catch((err) => {
                    console.log(err);
                });
            for (let i = 0; i < group_tests.length; i++) {
                await get_data.get_results_group_admin(id_group, group_tests[i].idtests)
                    .then((res) => {
                        group_tests[i].results = res[0][0];
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }

            return response.render(pathDir + "/views/groups/tests_results.hbs",
                {
                    title: "Основы SQL",
                    headPage: 'Образовательная система "Основы SQL"',
                    userName: verify[0].login,
                    page: "groups/tests_results",
                    viewHeader: true,
                    admin: true,
                    breadcrumb: breadcrumb,
                    group: group_shifr,
                    group_tests: group_tests,
                    helpers: {
                        success_of_test: hbs_helpers.success_of_test
                    }
                }
            );
            break;
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

    let cookies;
    try {
        cookies = cookiesString.split("; ");
    } catch (e) {
        cookies = "";
    }
    
    let token = "";
    for (let i = 0; i < cookies.length; i++){
        if (cookies[i].split("=")[0] == "CookieUser") {
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
                switch (Object.keys(res[0][0][0])[0]) {
                    case "idstudents":
                        user_checked[1] = "student";
                        break;
                    case "idadmins":
                        user_checked[1] = "admin";
                        break;
                    case "idlecturers":
                        user_checked[1] = "lecturer";
                        break;
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
    return user_checked;
}