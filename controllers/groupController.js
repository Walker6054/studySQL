const path = require('path');
const pathDir = path.dirname(__dirname);
const jwt = require("jsonwebtoken");

const hbs_helpers = require("../hbs_helpers/helpers");

const users = require("../models/users/users");
const students = require("../models/users/students");
const lecturers = require("../models/users/lecturers");
const admin = require("../models/users/admin");
const get_data = require("../models/get_data");
const groups = require("../models/tables/groups");


exports.index = async (request, response) => {
    let verify = await get_cookie_check_user(request.rawHeaders);

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
                        //console.log(res);
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
                        //console.log(res);
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

    let all_tests;
    let group_tests;
    let group_shifr;
    let add_enable = true;
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
                        group_tests = res[0][0];
                        //console.log(res);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                
                await get_data.get_lecturer_tests(verify[0].login)
                    .then((res) => {
                        //console.log(res);
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
                
                response.render(pathDir + "/views/groups/tests_update.hbs",
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
                await get_data.get_groups_tests(id_group)
                    .then((res) => {
                        group_tests = res[0][0];
                        //console.log(res);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                await get_data.get_tests()
                    .then((res) => {
                        //console.log(res);
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

                response.render(pathDir + "/views/groups/tests_update.hbs",
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

    } else {
        response.redirect("/login");
    }
};

exports.tests_results = async (request, response) => {
    let id_group = request.url.split("=")[1];
    let verify = await get_cookie_check_user(request.rawHeaders);

    //инициализация пути
    let breadcrumb = Array();
    breadcrumb.push({ title: "Главная", href: "", active: false });
    breadcrumb.push({ title: "Группы", href: "/groups", active: false });
    breadcrumb.push({ title: "Результаты выполнения тестов", href: "/tests_results", active: true });

    let group_tests;
    let group_shifr;
    await groups.groups(id_group)
        .then((res) => {
            group_shifr = "Тестирование группы: " + res[0][0].shifr;
        })
        .catch((err) => {
            group_shifr = "Данной группы не существует, либо у вас отсутствует доступ к ней!";
            console.log(err);
        });
    
    if (verify[0]) {
        switch (verify[1]) {
            case "student":
                response.redirect("/tests");
                break;
            
            case "lecturer":
                await get_data.get_group_tests(verify[0].login, id_group)
                    .then((res) => {
                        group_tests = res[0][0];
                        //console.log(res);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                for (let i = 0; i < group_tests.length; i++) {
                    await get_data.get_result_group(verify[0].login, id_group, group_tests[i].idtests)
                        .then((res) => {
                            group_tests[i].results = res[0][0];
                            //console.log(res);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
                
                response.render(pathDir + "/views/groups/tests_results.hbs",
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
                await get_data.get_groups_tests(id_group)
                    .then((res) => {
                        group_tests = res[0][0];
                        //console.log(res);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                for (let i = 0; i < group_tests.length; i++) {
                    await get_data.get_results_group_admin(id_group, group_tests[i].idtests)
                        .then((res) => {
                            group_tests[i].results = res[0][0];
                            //console.log(res);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }

                response.render(pathDir + "/views/groups/tests_results.hbs",
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