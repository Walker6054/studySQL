const path = require('path');
const pathDir = path.dirname(__dirname);
const jwt = require("jsonwebtoken");

const users = require("../models/users/users");
const lecturers = require('../models/users/lecturers');
const students = require('../models/users/students');
const get_data = require("../models/get_data");
const tests = require('../models/tables/tests');

const hbs_helpers = require("../hbs_helpers/helpers");


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
                let unfinished_test_user = new Array();
                let ends_tests = new Array();
                await students.get_student_tests(verify[0].login)
                    .then((res) => {
                        test_user = res[0][0];
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                for (let i = 0; i < test_user.length; i++) {
                    if (test_user[i].all_count == "") {
                        test_user[i].all_count = 0;
                        test_user[i].avg = 0;
                    } else {
                        let answers_test;
                        await students.get_result_student_test_with_answers(verify[0].login, test_user[i].idtests)
                            .then((res) => {
                                answers_test = res[0][0];
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                        test_user[i].answers = answers_test;
                    }
                    if (test_user[i].all_count == test_user[i].maxTry) {
                        ends_tests.push(test_user[i]);
                    } else {
                        unfinished_test_user.push(test_user[i]);
                    }
                }
                console.log(unfinished_test_user);
                console.log(ends_tests);
                
                response.render(pathDir + "/views/tests/tests.hbs",
                    {
                        title: "Основы SQL",
                        headPage: 'Образовательная система "Основы SQL"',
                        userName: verify[0].login,
                        page: "tests/tests",
                        viewHeader: true,
                        student: true,
                        breadcrumb: breadcrumb,
                        tests: unfinished_test_user,
                        ends_tests: ends_tests,
                        helpers: {
                            check_result_of_test: hbs_helpers.check_result_of_test,
                            success_of_test: hbs_helpers.success_of_test
                        }
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
                await get_data.get_tests()
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
                response.redirect("/tests");
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
        let test;
        let all_questions_res;

        switch (verify[1]) {
            case "student":
                response.redirect("/tests");
                break;
            
            case "lecturer":
                let flag_lecturer_test;
                await lecturers.check_lecturer_test(verify[0].login, idtest)
                    .then((res) => {
                        flag_lecturer_test = Object.values(res[0][0])[0];
                    })
                    .catch((err) => {
                        console.log(err);
                    })
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
                
                if ((test == undefined) || (all_questions_res.length == 0) || (!flag_lecturer_test)) {
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
            
            case "admin":
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