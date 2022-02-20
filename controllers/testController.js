const path = require('path');
const pathDir = path.dirname(__dirname);
const jwt = require("jsonwebtoken");

const users = require("../models/users");
const get_data = require("../models/get_data");
const tests = require('../models/tests');

exports.index = async (request, response) => {
    let verify = await get_cookie_check_user(request.rawHeaders);

    //инициализация пути
    let breadcrumb = Array();
    breadcrumb.push({ title: "Главная", href: "", active: false });
    breadcrumb.push({ title: "Тесты", href: "/tests", active: true });

    if (verify[0]) {
        let test_user;
        switch (verify[1]) {
            case "student":
                response.render(pathDir + "/views/tests/tests.hbs",
                    {
                        title: "Основы SQL",
                        headPage: 'Образовательная система "Основы SQL"',
                        userName: verify[0].login,
                        page: "tests/tests",
                        viewHeader: true,
                        student: true,
                        breadcrumb: breadcrumb,
                        tests: test_user
                    }
                );
                break;
            case "lecturer":
                await get_data.get_lecturer_tests(verify[0].login)
                    .then((res) => {
                        test_user = res[0][0];
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                response.render(pathDir + "/views/tests/tests.hbs",
                    {
                        title: "Основы SQL",
                        headPage: 'Образовательная система "Основы SQL"',
                        userName: verify[0].login,
                        page: "tests/tests",
                        viewHeader: true,
                        lecturer: true,
                        breadcrumb: breadcrumb,
                        tests: test_user
                    }
                );
                break;
            case "admin":
                response.render(pathDir + "/views/tests/tests.hbs",
                    {
                        title: "Основы SQL",
                        headPage: 'Образовательная система "Основы SQL"',
                        userName: verify[0].login,
                        page: "tests/tests",
                        viewHeader: true,
                        admin: true,
                        breadcrumb: breadcrumb,
                        tests: test_user
                    }
                );
                break;
        }

    } else {
        response.redirect("/login");
    }
};

exports.new_test = async (request, response) => {
    let verify = await get_cookie_check_user(request.rawHeaders);

    //инициализация пути
    let breadcrumb = Array();
    breadcrumb.push({ title: "Главная", href: "", active: false });
    breadcrumb.push({ title: "Тесты", href: "/tests", active: false });
    breadcrumb.push({ title: "Создание теста", href: "/tests/new_test", active: true });
    
    if (verify[0]) {
        switch (verify[1]) {
            case "student":
                response.redirect("/tests");
                break;
            case "lecturer":
                    response.render(pathDir + "/views/tests/new_test.hbs",
                    {
                        title: "Основы SQL",
                        headPage: 'Образовательная система "Основы SQL"',
                        userName: verify[0].login,
                        page: "tests/new_test",
                        viewHeader: true,
                        breadcrumb: breadcrumb
                    }
                );
                break;
            case "admin":
                response.render(pathDir + "/views/tests/new_test.hbs",
                    {
                        title: "Основы SQL",
                        headPage: 'Образовательная система "Основы SQL"',
                        userName: verify[0].login,
                        page: "tests/new_test",
                        viewHeader: true,
                        breadcrumb: breadcrumb
                    }
                );
                break;
        }
    } else {
        response.redirect("/login");
    }
};

exports.update_test = async (request, response) => {
    let idtest = request.url.split("=")[1];
    let verify = await get_cookie_check_user(request.rawHeaders);

    //инициализация пути
    let breadcrumb = Array();
    breadcrumb.push({ title: "Главная", href: "", active: false });
    breadcrumb.push({ title: "Тесты", href: "/tests", active: false });
    breadcrumb.push({ title: "Изменение теста", href: "/update_test", active: true });
    
    if (verify[0]) {
        switch (verify[1]) {
            case "student":
                response.redirect("/tests");
                break;
            
            default:
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
                    //форматирование вопросов для отображения на странице
                    let all_questions = Array();
                    for (let i = 0; i < all_questions_res.length; i++) {
                        let answers = all_questions_res[i].answers[0];
                        for (let j = 1; j < all_questions_res[i].answers.length; j++) {
                            answers += "\n" + all_questions_res[i].answers[j];
                        }
                        let ranswers = all_questions_res[i].rightAnswer[0];
                        for (let j = 1; j < all_questions_res[i].rightAnswer.length; j++) {
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
                            userName: verify[0].login,
                            page: "tests/update_test",
                            viewHeader: true,
                            breadcrumb: breadcrumb,
                            test: test,
                            questions: all_questions
                        }
                    );
                }
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