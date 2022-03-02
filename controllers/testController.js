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

    if (!verify[0]) {
        return response.redirect("/login");
    }
    
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
            let ends_tests_exist = false;
            if (ends_tests.length != 0) {
                ends_tests_exist = true;
            }
            
            return response.render(pathDir + "/views/tests/tests.hbs",
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
                    ends_tests_exist: ends_tests_exist,
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
            return response.render(pathDir + "/views/tests/tests.hbs",
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
            return response.render(pathDir + "/views/tests/tests.hbs",
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
};

exports.new_test = async (request, response) => {
    let verify = await get_cookie_check_user(request.rawHeaders);

    //инициализация пути
    let breadcrumb = Array();
    breadcrumb.push({ title: "Главная", href: "", active: false });
    breadcrumb.push({ title: "Тесты", href: "/tests", active: false });
    breadcrumb.push({ title: "Создание теста", href: "/tests/new_test", active: true });
    
    if (!verify[0]) {
        return response.redirect("/login");
    }

    switch (verify[1]) {
        case "student":
            return response.redirect("/tests/");
            break;
        case "lecturer":
            return response.render(pathDir + "/views/tests/new_test.hbs",
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
            return response.redirect("/tests/");
            break;
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
    
    if (!verify[0]) {
        return response.redirect("/login");
    }

    let test;
    let all_questions_res;
    let all_questions = Array();
    switch (verify[1]) {
        case "student":
            return response.redirect("/tests/");
            break;
        
        case "lecturer":
            let flag_lecturer_test;
            await lecturers.check_lecturer_test(verify[0].login, idtest)
                .then((res) => {
                    flag_lecturer_test = Object.values(res[0][0][0])[0];
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
                    console.log(res);
                    all_questions_res = res[0][0];
                })
                .catch((err) => {
                    console.log(err);
                })
            
            if ((test == undefined) || (all_questions_res.length == 0) || (!flag_lecturer_test)) {
                return response.redirect("/tests/");
            }

            //форматирование вопросов для отображения на странице
            for (let i = 0; i < all_questions_res.length; i++) {
                let arr_answers = JSON.parse(all_questions_res[i].answers);
                let answers = arr_answers[0];
                for (let j = 1; j < arr_answers.length; j++) {
                    answers += "\n" + arr_answers[j];
                }

                let arr_ranswers = JSON.parse(all_questions_res[i].rightAnswer);
                let ranswers = arr_ranswers[0];
                for (let j = 1; j < arr_ranswers.length; j++) {
                    ranswers += "\n" + arr_ranswers[j];
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

            return response.render(pathDir + "/views/tests/update_test.hbs",
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
                return response.redirect("/tests/");
            }

            //форматирование вопросов для отображения на странице
            for (let i = 0; i < all_questions_res.length; i++) {
                let arr_answers = JSON.parse(all_questions_res[i].answers);
                let answers = arr_answers[0];
                for (let j = 1; j < arr_answers.length; j++) {
                    answers += "\n" + arr_answers[j];
                }

                let arr_ranswers = JSON.parse(all_questions_res[i].rightAnswer);
                let ranswers = arr_ranswers[0];
                for (let j = 1; j < arr_ranswers.length; j++) {
                    ranswers += "\n" + arr_ranswers[j];
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

            return response.render(pathDir + "/views/tests/update_test.hbs",
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
            break;
    }
};

exports.solve_test = async (request, response) => {
    let id_test = request.url.split("=")[1];
    let verify = await get_cookie_check_user(request.rawHeaders);

    //инициализация пути
    let breadcrumb = Array();
    breadcrumb.push({ title: "Главная", href: "", active: false });
    breadcrumb.push({ title: "Тесты", href: "/tests", active: false });
    breadcrumb.push({ title: "Прохождение теста", href: "/solve_test", active: true });

    if (!verify[0]) {
        return response.redirect("/login");
    }

    switch (verify[1]) {
        case "student":
            let test_user;
            let questions;
            let error;
            await students.get_student_test(verify[0].login, id_test)
                .then((res) => {
                    test_user = res[0][0];
                    error = test_user.length;
                })
                .catch((err) => {
                    error = err;
                });
            
            if ((error == 0) || (error.code) || (test_user[0].all_count == test_user[0].maxTry)) {
                return response.redirect("/tests/");
            }

            let questions_for_list = new Array();
            await get_data.get_questions_test(id_test)
                .then((res) => {
                    questions = res[0][0];
                })
                .catch((err) => {
                    console.log(err);
                });
            
            //преобразование вопросов для отрисовки
            for (let i = 0; i < questions.length; i++) {
                let interactive = false;
                if (questions[i].interactive) {
                    interactive = true;
                    questions[i].formulation = questions[i].formulation.split(/\{\w+\}/);
                }

                let temp = {
                    id: questions[i].idquestions,
                    formulation: questions[i].formulation,
                    comment: questions[i].comment,
                    interactive: interactive,
                    answers: JSON.parse(questions[i].answers),
                    count_right_answers: JSON.parse(questions[i].rightAnswer).length
                };
                questions_for_list.push(temp);
            }

            return response.render(pathDir + "/views/tests/solve_test.hbs",
                {
                    title: "Основы SQL",
                    headPage: 'Образовательная система "Основы SQL"',
                    userName: verify[0].login,
                    page: "tests/solve_test",
                    viewHeader: true,
                    student: true,
                    breadcrumb: breadcrumb,
                    questions: questions_for_list,
                    helpers: {
                        type_question: hbs_helpers.type_question,
                        return_index: hbs_helpers.return_index,
                        create_drag_drop_block: hbs_helpers.create_drag_drop_block,
                        return_index_to_answers: hbs_helpers.return_index_to_answers
                    }
                }
            );
            break;
        
        case "lecturer":
            return response.redirect("/tests/");
        
        case "admin":
            return response.redirect("/tests/");
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