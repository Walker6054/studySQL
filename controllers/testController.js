const path = require('path');
const pathDir = path.dirname(__dirname);
const jwt = require("jsonwebtoken");

const users = require("../models/users");
const get_data = require("../models/get_data");
const tests = require('../models/tests');

exports.index = async (request, response) => {
    let cookieUser = getCookie(request.rawHeaders);

    if ((cookieUser != "") && (cookieUser != "false")) {
        let user;
        await checkToken(cookieUser)
            .then((res) => {
                user = res;
            })
            .catch((err) => {
                console.log(err);
            });
        
        let type;
        await get_data.return_type_user(user.login)
            .then((res) => {
                type = Object.values(res[0][0])[0];
            })
            .catch((err) => {
                console.log(err);
            })
        
        let flagStudent = false;
        let flagLecturer = false;
        let flagAdmin = false;
        let test_lecturer;
        switch (type) {
            case "student":
                flagStudent = true;
                break;
            case "lecturer":
                flagLecturer = true;
                await get_data.get_lecturer_tests(user.login)
                    .then((res) => {
                        test_lecturer = res[0][0];
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                break;
            case "admin":
                flagAdmin = true;
                break;
        }

        //инициализация пути
        let breadcrumb = Array();
        breadcrumb.push({ title: "Главная", href: "", active: false });
        breadcrumb.push({ title: "Тесты", href: "/tests", active: true });

        response.render(pathDir + "/views/tests/tests.hbs",
            {
                title: "Основы SQL",
                headPage: 'Образовательная система "Основы SQL"',
                userName: user.login,
                page: "tests/tests",
                viewHeader: true,
                student: flagStudent,
                lecturer: flagLecturer,
                admin: flagAdmin,
                breadcrumb: breadcrumb,
                tests: test_lecturer
            }
        );
    } else {
        response.redirect("/login");
    }
};

exports.new_test = async (request, response) => {
    let cookieUser = getCookie(request.rawHeaders);

    if ((cookieUser != "") && (cookieUser != "false")) {
        let user;
        await checkToken(cookieUser)
            .then((res) => {
                user = res;
            })
            .catch((err) => {
                console.log(err);
            });
        
        let type;
        await get_data.return_type_user(user.login)
            .then((res) => {
                type = Object.values(res[0][0])[0];
            })
            .catch((err) => {
                console.log(err);
            })
        
        let flagStudent = false;
        let flagLecturer = false;
        let flagAdmin = false;
        switch (type) {
            case "student":
                flagStudent = true;
                break;
            case "lecturer":
                flagLecturer = true;
                await get_data.get_lecturer_tests(user.login)
                    .then((res) => {
                        test_lecturer = res[0][0];
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                break;
            case "admin":
                flagAdmin = true;
                break;
        }

        //инициализация пути
        let breadcrumb = Array();
        breadcrumb.push({ title: "Главная", href: "", active: false });
        breadcrumb.push({ title: "Тесты", href: "/tests", active: false });
        breadcrumb.push({ title: "Создание теста", href: "/tests/new_test", active: true });

        if (flagStudent) {
            response.redirect("/tests");
        } else {
            response.render(pathDir + "/views/tests/new_test.hbs",
                {
                    title: "Основы SQL",
                    headPage: 'Образовательная система "Основы SQL"',
                    userName: user.login,
                    page: "tests/new_test",
                    viewHeader: true,
                    student: flagStudent,
                    lecturer: flagLecturer,
                    admin: flagAdmin,
                    breadcrumb: breadcrumb
                }
            );
        }
    } else {
        response.redirect("/login");
    }
};

exports.update_test = async (request, response) => {
    let cookieUser = getCookie(request.rawHeaders);
    let idtest = request.url.split("=")[1];

    if ((cookieUser != "") && (cookieUser != "false")) {
        let user;
        await checkToken(cookieUser)
            .then((res) => {
                user = res;
            })
            .catch((err) => {
                console.log(err);
            });
        
        let type;
        await get_data.return_type_user(user.login)
            .then((res) => {
                type = Object.values(res[0][0])[0];
            })
            .catch((err) => {
                console.log(err);
            })
        
        let flagStudent = false;
        let flagLecturer = false;
        let flagAdmin = false;
        switch (type) {
            case "student":
                flagStudent = true;
                break;
            case "lecturer":
                flagLecturer = true;
                break;
            case "admin":
                flagAdmin = true;
                break;
        }

        //инициализация пути
        let breadcrumb = Array();
        breadcrumb.push({ title: "Главная", href: "", active: false });
        breadcrumb.push({ title: "Тесты", href: "/tests", active: false });
        breadcrumb.push({ title: "Изменение теста", href: "update_test", active: true });

        if (flagStudent) {
            response.redirect("/tests");
        } else {
            let test;
            let all_questions_res;
            await tests.tests(idtest)
                .then((res) => {
                    test = res[0][0];
                })
                .catch((err) => {
                    console.log(err);
                })
            await get_data.get_questions_test(idtest)
                .then((res) => {
                    all_questions_res = res[0][0];
                })
                .catch((err) => {
                    console.log(err);
                })
            
            if ((test == undefined) || (all_questions_res.length == 0)) {
                response.redirect("/tests/");
            } else {
                let all_questions = Array();
                for (let i = 0; i < all_questions_res.length; i++) {
                    let answers = all_questions_res[i].answers[0];
                    for (let j = 1; j < all_questions_res[i].answers.length; j++){
                        answers += "\n" + all_questions_res[i].answers[j];
                    }
                    let ranswers = all_questions_res[i].rightAnswer[0];
                    for (let j = 1; j < all_questions_res[i].rightAnswer.length; j++){
                        ranswers += "\n" + all_questions_res[i].rightAnswer[j];
                    }
                    let interactive = "";
                    let hidden = "";
                    if (all_questions_res[i].interactive == 1) {
                        interactive = "checked";
                        hidden = "hidden";
                    }
                    let temp = {
                        formulation: all_questions_res[i].formulation,
                        comment: all_questions_res[i].comment,
                        answers: answers,
                        rightAnswer: ranswers,
                        interactive: interactive,
                        hidden: hidden
                    }
                    all_questions.push(temp);
                }

                response.render(pathDir + "/views/tests/update_test.hbs",
                    {
                        title: "Основы SQL",
                        headPage: 'Образовательная система "Основы SQL"',
                        userName: user.login,
                        page: "tests/update_test",
                        viewHeader: true,
                        lecturer: flagLecturer,
                        admin: flagAdmin,
                        breadcrumb: breadcrumb,
                        test: test,
                        questions: all_questions
                    }
                );
            }
        }
    } else {
        response.redirect("/login");
    }
};

exports.group_test = async (request, response) => {
    let cookieUser = getCookie(request.rawHeaders);

    if ((cookieUser != "") && (cookieUser != "false")) {
        let user;
        await checkToken(cookieUser)
            .then((res) => {
                user = res;
            })
            .catch((err) => {
                console.log(err);
            });
        
        let type;
        await get_data.return_type_user(user.login)
            .then((res) => {
                type = Object.values(res[0][0])[0];
            })
            .catch((err) => {
                console.log(err);
            })
        
        let flagStudent = false;
        let flagLecturer = false;
        let flagAdmin = false;
        switch (type) {
            case "student":
                flagStudent = true;
                break;
            case "lecturer":
                flagLecturer = true;
                break;
            case "admin":
                flagAdmin = true;
                break;
        }

        if (flagStudent) {
            response.redirect("/");
        } else {
            response.render(pathDir + "/views/tests/group_test.hbs",
                {
                    title: "Основы SQL",
                    headPage: 'Образовательная система "Основы SQL"',
                    userName: user.login,
                    page: "tests/group_test",
                    viewHeader: true,
                    lecturer: flagLecturer,
                    admin: flagAdmin
                }
            );
        }
    } else {
        response.redirect("/login");
    }
};

exports.result_tests = async (request, response) => {
    let cookieUser = getCookie(request.rawHeaders);

    if ((cookieUser != "") && (cookieUser != "false")) {
        let user;
        await checkToken(cookieUser)
            .then((res) => {
                user = res;
            })
            .catch((err) => {
                console.log(err);
            });
        
        let type;
        await get_data.return_type_user(user.login)
            .then((res) => {
                type = Object.values(res[0][0])[0];
            })
            .catch((err) => {
                console.log(err);
            })
        
        let flagStudent = false;
        let flagLecturer = false;
        let flagAdmin = false;
        switch (type) {
            case "student":
                flagStudent = true;
                break;
            case "lecturer":
                flagLecturer = true;
                break;
            case "admin":
                flagAdmin = true;
                break;
        }
        response.render(pathDir + "/views/tests/result_tests.hbs",
            {
                title: "Основы SQL",
                headPage: 'Образовательная система "Основы SQL"',
                userName: user.login,
                page: "tests/result_tests",
                viewHeader: true,
                student: flagStudent,
                lecturer: flagLecturer,
                admin: flagAdmin
            }
        );
    } else {
        response.redirect("/login");
    }
};


async function checkToken(token) {
    let user = jwt.decode(token);
    let userDB;
    let final;
    await users.users(user.login)
        .then((res) => {
            userDB = res[0][0][0];
        })
        .catch((err) => {
            console.log(err);
        })
    final = jwt.verify(token, userDB.idusers.toString());
    return final;
}

function getCookie(req) {
    let cookiesString;
    for (let i = 0; i < req.length; i++){
        if (req[i] == "Cookie") {
            cookiesString = req[i + 1];
            break;
        }
    }
    let cookies = cookiesString.split("; ");
    let cookieUser = "";
    for (let i = 0; i < cookies.length; i++){
        if (cookies[i].split("=")[0] == "C0o1o2k3i4e5L6o7g8i9n10U11s12e13r14") {
            cookieUser = cookies[i].split("=")[1];
            break;
        }
    }
    return cookieUser;
}