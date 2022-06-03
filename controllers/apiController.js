const jwt = require("jsonwebtoken");

const users = require("../models/users/users");
const students = require("../models/users/students");
const admins = require("../models/users/admin");
const lecturers = require("../models/users/lecturers");

const tests = require("../models/tables/tests");
const groups= require("../models/tables/groups");
const questions = require("../models/tables/questions");
const groups_tests = require("../models/relations/groups_tests");
const lecturers_groups = require("../models/relations/lecturers_groups");
const marks_tests = require("../models/relations/marks_tests");
const marks_questions = require("../models/relations/marks_questions");
const get_data = require("../models/get_data");

const mailer = require("../mailer/mailer");

//авторизация/регистрация/восстановление пароля
exports.reguser = async (request, response) => {
    let data = request.body;
    let sqlIn = sqlIniect(data);

    if (sqlIn) {
        return response.status(800).send("Попытка SQL-инъекции!");
    }

    let user;
    let token;
    switch (data.type) {
        case "stud":
            let responseDbStud;
            await students.addStudents(data.login, data.email, data.pass, data.group, data.f, data.i, data.o)
                .catch((err) => {
                    console.log(err);
                    responseDbStud = err;
                })
            if (responseDbStud) {
                type_err = responseDbStud.message.split(".")[1].split("_")[0];
                return response.status(800).send("Пользователь с таким "+type_err+" уже существует!");
            }

            await users.users(data.login)
                .then((res) => {
                    user = res[0][0][0];
                })
                .catch((err) => {
                    console.log(err);
                });
            token = jwt.sign({
                login: user.login,
                email: user.email
            }, user.idusers.toString());

            mailer.sendMail(user.email, user.login, "reg");
            response.status(200).send(token);
            break;
        
        case "lect":
            let responseDbLect;
            await lecturers.addLecturers(data.login, data.pass, data.email, data.f, data.i, data.o, data.inst)
                .catch((err) => {
                    console.log(err);
                    responseDbLect = err;
                });
            if (responseDbLect) {
                type_err = responseDbLect.message.split(".")[1].split("_")[0];
                return response.status(800).send("Пользователь с таким "+type_err+" уже существует!");
            }

            await users.users(data.login)
                .then((res) => {
                    user = res[0][0][0];
                })
                .catch((err) => {
                    console.log(err);
                });
            token = jwt.sign({
                login: user.login,
                email: user.email
            }, user.idusers.toString());

            mailer.sendMail(user.email, user.login, "reg");
            response.status(200).send(token);
            break;
    }
}
exports.loguser = async (request, response) => {
    let data = request.body;
    console.log(data);
    let sqlIn = sqlIniect(data);

    if (sqlIn) {
        return response.status(800).send("Попытка SQL-инъекции!");
    }

    let exists;
    await users.users(data.login)
        .then((res) => {
            exists = res[0][0][0];
        })
        .catch((err) => {
            console.log(err);
        })

    if (!((exists) || (((data.login == exists.login) || (data.login == exists.email)) && (data.pass == exists.password)))) {
        return response.status(801).send("Пользователь с таким логином и паролем не существует! Проверьте правильность введенных данных!");
    }

    let token = jwt.sign({
        login: exists.login,
        email: exists.email
    }, exists.idusers.toString())

    return response.status(200).send(token);
}
exports.forgotpass = async (request, response) => {
    let data = request.body;
    console.log(data);
    let sqlIn = sqlIniect(data);

    if (sqlIn) {
        return response.status(800).send("Попытка SQL-инъекции!");
    }

    let exists;
    await users.users(data.login)
        .then((res) => {
            exists = res[0][0][0];
        })
        .catch((err) => {
            console.log(err);
        });

    if (exists) {
        if (data.login != exists.login && data.login != exists.email) {
            return response.status(801).send("Пользователь с таким логином или email не существует!\nПроверьте правильность введенных данных!");
        }
    } else {
        return response.status(801).send("Пользователь с таким логином или email не существует!\nПроверьте правильность введенных данных!");
    }
    

    let token = jwt.sign({
        type: "Восстановление пароля",
        login: exists.login,
        email: exists.email,
        date: Date.now()
    }, exists.idusers.toString());

    await mailer.sendMail(exists.email, exists.login, "forgot", '<a href="https://study-sql.herokuapp.com/registration/recoveryPass=' + token + '">')
        .then((res) => {
            switch (res) {
                case true:
                    return response.status(200).send("Письмо с дальнейшими инструкциями выслано на почтовый ящик, указанный при регистрации!");
                    break;
                case false:
                    return response.status(801).send("Произошла ошибка при отправке письма!");
                    break;
            }
        })
        .catch((err) => {
            console.log(err);
        });
}
exports.recoverypass = async (request, response) => {
    let data = request.body;
    console.log(data);
    let sqlIn = sqlIniect(data);

    if (sqlIn) {
        return response.status(800).send("Попытка SQL-инъекции!");
    }

    let exists;
    await users.users(jwt.decode(data.token).login)
        .then((res) => {
            exists = res[0][0][0];
        })
        .catch((err) => {
            console.log(err);
        })

    try {
        let checkUser = jwt.verify(data.token, exists.idusers.toString());
        if (!(exists && checkUser)) {
            return response.status(801).send("Попытка подмены токена!");
        }

        await users.updateUsers(exists.idusers, exists.login, data.pass, exists.email)
            .then((res) => {
                mailer.sendMail(exists.email, exists.login, "rec");
                return response.status(200).send("Пароль успешно изменен!");
            })
            .catch((err) => {
                console.log(err);
                return response.status(801).send("Ошибка при изменении пароля!");
            });
        
    } catch (err) {
        console.log(err);
        response.status(801).send("Попытка подмены токена!");
    }
}

//изменение данных в ЛК
exports.update_user = async (request, response) => {
    let data = request.body;
    console.log(data);

    let sqlIn = sqlIniect(data);
    if (sqlIn) {
        return response.status(800).send("Попытка SQL-инъекции!");
    }

    let verify = await check_user(data.token)
        .catch((err) => {
            console.log(err);
        });
    if (!verify[0]) {
        return response.status(801).send("Ошибка верификации пользователя!");
    }

    if (data.new_pass) {
        data.old_pass = data.new_pass;
    }

    let flag = 0;
    let id_user;
    switch (verify[1]) {
        case "admin":
            await admins.id_admins(verify[0].login)
                .then((res) => {
                    console.log(res);
                    id_user = res[0][0][0].idadmins;
                })
                .catch((err) => {
                    console.log(err);
                })
            await admins.lk_updateAdmins(id_user, data.old_pass, data.email)
                .then((res) => {
                    flag = res[0].affectedRows;
                })
                .catch((err) => {
                    console.log(err);
                    flag = -1;
                })
            switch (flag) {
                case 0:
                    response.status(800).send("Исходные данные не были изменены!");
                    break;
                case -1:
                    response.status(801).send("Произошла ошибка при изменении данных!");
                    break;
                default:
                    response.status(200).send("Данные успешно обновлены!");
                    break;
            }
            break;
        
        case "lecturer":
            await lecturers.id_lecturers(verify[0].login)
                .then((res) => {
                    console.log(res);
                    id_user = res[0][0][0].idlecturers;
                })
                .catch((err) => {
                    console.log(err);
                })
            await lecturers.lk_updateLecturers(id_user, data.old_pass, data.email, data.f, data.i, data.o, data.inst)
                .then((res) => {
                    flag = res[0].affectedRows;
                })
                .catch((err) => {
                    console.log(err);
                    flag = -1;
                })
            switch (flag) {
                case 0:
                    response.status(800).send("Исходные данные не были изменены!");
                    break;
                case -1:
                    response.status(801).send("Произошла ошибка при изменении данных!");
                    break;
                default:
                    response.status(200).send("Данные успешно обновлены!");
                    break;
            }
            break;
        
        case "student":
            await students.id_students(verify[0].login)
                .then((res) => {
                    console.log(res);
                    id_user = res[0][0][0].idstudents;
                })
                .catch((err) => {
                    console.log(err);
                })
            await students.lk_updateStudents(id_user, data.old_pass, data.email, data.f, data.i, data.o)
                .then((res) => {
                    flag = res[0].affectedRows;
                })
                .catch((err) => {
                    console.log(err);
                    flag = -1;
                })
            switch (flag) {
                case 0:
                    response.status(800).send("Исходные данные не были изменены!");
                    break;
                case -1:
                    response.status(801).send("Произошла ошибка при изменении данных!");
                    break;
                default:
                    response.status(200).send("Данные успешно обновлены!");
                    break;
            }
            break;
        }
}

//раздел студентов
exports.del_student = async (request, response) => {
    let data = request.body;
    console.log(data);

    let verify = await check_user(data.token);
    
    if (!verify[0]) {
        return response.status(801).send("Ошибка в авторизации пользователя!");
    }

    await students.delStudents(data.id)
        .then((res) => {
            if (res[0].affectedRows > 0) {
                response.status(200).send("Студент успешно удален!");
            } else {
                response.status(801).send("Ошибка при удалении студента");
            }
        })
        .catch((err) => {
            console.log(err);
            response.status(801).send("Ошибка при удалении студента");
        });
}
exports.add_student = async (request, response) => {
    let data = request.body;
    console.log(data);

    let verify = await check_user(data.token);
    
    if (!verify[0]) {
        return response.status(801).send("Ошибка в авторизации пользователя!");
    }

    await students.addStudents(data.login, data.email, data.pass, data.group, data.f, data.i, data.o)
        .then((res) => {
            if (res[0].affectedRows > 0) {
                response.status(200).send("Студент успешно добавлен!");
            } else {
                response.status(801).send("Ошибка при добавлении студента");
            }
        })
        .catch((err) => {
            console.log(err);
            response.status(801).send("Ошибка при добавлении студента");
        });
    
    //добавить рассылку с логином и паролем
}
exports.update_student = async (request, response) => {
    let data = request.body;
    console.log(data);

    let verify = await check_user(data.token);
    
    if (!verify[0]) {
        return response.status(801).send("Ошибка в авторизации пользователя!");
    }

    await students.updateStudents(data.id, data.login, data.email, data.group, data.f, data.i, data.o)
        .then((res) => {
            if (res[0].affectedRows > 0) {
                response.status(200).send("Студент успешно изменен!");
            } else {
                response.status(801).send("Ошибка при изменении студента");
            }
        })
        .catch((err) => {
            console.log(err);
            response.status(801).send("Ошибка при изменении студента");
        });
}

//раздел преподавателей
exports.del_lecturer = async (request, response) => {
    let data = request.body;
    console.log(data);

    let verify = await check_user(data.token);
    
    if (!verify[0]) {
        return response.status(801).send("Ошибка в авторизации пользователя!");
    }

    await lecturers.delLecturers(data.id)
        .then((res) => {
            if (res[0].affectedRows > 0) {
                response.status(200).send("Преподаватель успешно удален!");
            } else {
                response.status(801).send("Ошибка при удалении преподавателя");
            }
        })
        .catch((err) => {
            console.log(err);
            response.status(801).send("Ошибка при удалении преподавателя");
        });
}
exports.add_lecturer = async (request, response) => {
    let data = request.body;
    console.log(data);

    let verify = await check_user(data.token);
    
    if (!verify[0]) {
        return response.status(801).send("Ошибка в авторизации пользователя!");
    }

    await lecturers.addLecturers(data.login, data.pass, data.email, data.f, data.i, data.o, data.inst)
        .then((res) => {
            if (res[0].affectedRows > 0) {
                response.status(200).send("Преподаватель успешно добавлен!");
            } else {
                response.status(801).send("Ошибка при добавлении преподавателя");
            }
        })
        .catch((err) => {
            console.log(err);
            response.status(801).send("Ошибка при добавлении преподавателя");
        });
    
    //добавить рассылку с логином и паролем
}
exports.update_lecturer = async (request, response) => {
    let data = request.body;
    console.log(data);

    let verify = await check_user(data.token);
    
    if (!verify[0]) {
        return response.status(801).send("Ошибка в авторизации пользователя!");
    }

    await lecturers.updateLecturers(data.id, data.login, data.email, data.f, data.i, data.o, data.inst)
        .then((res) => {
            if (res[0].affectedRows > 0) {
                response.status(200).send("Преподаватель успешно изменен!");
            } else {
                response.status(801).send("Ошибка при изменении преподавателя");
            }
        })
        .catch((err) => {
            console.log(err);
            response.status(801).send("Ошибка при изменении преподавателя");
        });
}
exports.del_lecturer_group = async (request, response) => {
    let data = request.body;
    console.log(data);

    let verify = await check_user(data.token);
    
    if (!verify[0]) {
        return response.status(801).send("Ошибка в авторизации пользователя!");
    }

    await lecturers_groups.delLecturers_groups(data.id)
        .then((res) => {
            if (res[0].affectedRows > 0) {
                response.status(200).send("Группа успешно откреплена!");
            } else {
                response.status(801).send("Ошибка при откреплении группы");
            }
        })
        .catch((err) => {
            console.log(err);
            response.status(801).send("Ошибка при откреплении группы");
        });
}
exports.add_lecturer_group = async (request, response) => {
    let data = request.body;
    console.log(data);

    let verify = await check_user(data.token);
    
    if (!verify[0]) {
        return response.status(801).send("Ошибка в авторизации пользователя!");
    }

    await lecturers_groups.addLecturers_groups(data.login_lecturer, data.id_group)
        .then((res) => {
            if (res[0].affectedRows > 0) {
                response.status(200).send("Группа успешно прикреплена!");
            } else {
                response.status(801).send("Ошибка при прикреплении группы");
            }
        })
        .catch((err) => {
            console.log(err);
            response.status(801).send("Ошибка при прикреплении группы");
        });
}

//раздел тестов
exports.del_test = async (request, response) => {
    let data = request.body;
    console.log(data);

    let verify = await check_user(data.token);
    
    if (!verify[0]) {
        return response.status(801).send("Ошибка в авторизации пользователя!");
    }

    await tests.delTests(data.id)
        .then((res) => {
            if (res[0].affectedRows > 0) {
                response.status(200).send("Тест успешно удален!");
            } else {
                response.status(801).send("Ошибка при удалении теста");
            }
        })
        .catch((err) => {
            console.log(err);
            response.status(801).send("Ошибка при удалении теста");
        });
}
exports.update_test = async (request, response) => {
    let data = request.body;
    console.log(data);

    let verify = await check_user(data.token);
    if (!verify[0]) {
        return response.status(801).send("Ошибка в авторизации пользователя!");
    }

    let flag_add_test;
    await tests.updateTests(Number(data.id), data.name, data.desc, data.maxTry)
        .then((res) => {
            flag_add_test = res[0].affectedRows;
        })
        .catch((err) => {
            console.log(err);
            flag_add_test = false;
        });
    
    if ((flag_add_test == 0) || (flag_add_test == false)) {
        return response.status(801).send("Ошибка при изменении теста!");
    }

    let old_questions;
    await get_data.get_questions_test(data.id)
        .then((res) => {
            old_questions = res[0][0];
        })
        .catch((err) => {
            console.log(err);
        })
    for (let i = 0; i < old_questions.length; i++) {
        await questions.delQuestions(old_questions[i].idquestions)
            .catch((err) => {
                console.log(err);
            })
    }
    
    let proc_is_ok = true;
    for (let i = 0; i < data.questions.length; i++) {
        let flag_interactive;
        if (data.questions[i].interactive) {
            flag_interactive = 1;
        } else {
            flag_interactive = 0;
        }
        let rightAnswers = data.questions[i].rightAnswer.split("\n");
        rightAnswers.forEach((el) => {
            el = Number(el) - 1;
        })

        await questions.addQuestions(
            data.id,
            data.questions[i].formilation,
            JSON.stringify(data.questions[i].answers.split("\n")),
            JSON.stringify(rightAnswers),
            data.questions[i].comment,
            flag_interactive
        )
            .catch((err) => {
                console.log(err);
                proc_is_ok = false;
                
            })
    }
    if (proc_is_ok) {
        return response.status(200).send("Тест успешно изменен!");
    } else {
        return response.status(801).send("Ошибка при изменении одного из вопросов!");
    }
}
exports.new_test = async (request, response) => {
    let data = request.body;
    console.log(data);

    let verify = await check_user(data.token);
    if (!verify[0]) {
        return response.status(801).send("Ошибка в авторизации пользователя!");
    }

    let flag_add_test;
    await tests.addTests(verify[0].login, data.name, data.desc, data.maxTry)
        .then((res) => {
            flag_add_test = res[0].affectedRows;
        })
        .catch((err) => {
            console.log(err);
            flag_add_test = false;
        });
    
    if ((flag_add_test == 0) || (flag_add_test == false)) {
        return response.status(801).send("Ошибка при добавлении теста!");
    }

    let idtest;
    await get_data.get_lecturer_tests(verify[0].login)
        .then((res) => {
            idtest = get_max_idtests(res[0][0]);
        })
        .catch((err) => {
            console.log(err);
        });
    
    let proc_is_ok = true;
    for (let i = 0; i < data.questions.length; i++) {
        let flag_interactive;
        if (data.questions[i].interactive) {
            flag_interactive = 1;
        } else {
            flag_interactive = 0;
        }
        let rightAnswers = data.questions[i].rightAnswer.split("\n");

        await questions.addQuestions(
            idtest,
            data.questions[i].formilation,
            JSON.stringify(data.questions[i].answers.split("\n")),
            JSON.stringify(rightAnswers),
            data.questions[i].comment,
            flag_interactive
        )
            .catch((err) => {
                console.log(err);
                proc_is_ok = false;
                
            })
    }
    if (proc_is_ok) {
        return response.status(200).send("Тест успешно добавлен!");
    } else {
        return response.status(801).send("Ошибка при добавлении одного из вопросов!");
    }
}
exports.check_solve_test = async (request, response) => {
    let data = request.body;
    console.log(data);

    let verify = await check_user(data.token);
    if (!verify[0]) {
        return response.status(801).send("Ошибка в авторизации пользователя!");
    }

    let questions_test_from_db;
    let error = false;
    await get_data.get_questions_test(data.id_test)
        .then((res) => {
            questions_test_from_db = res[0][0];
        })
        .catch((err) => {
            console.log(err);
            error = true;
        });
    
    if (error || (questions_test_from_db.length == 0)) {
        return response.status(801).send("Ошибка при проверке теста");
    }

    //получение номера последней попытки студента по тесту
    let last_try;
    await students.return_try_count_test(verify[0].login, data.id_test)
        .then((res) => {
            if (Object.values(res[0][0])[0] == null) {
                last_try = 0;
            } else {
                last_try = Object.values(res[0][0][0])[0];
            }
        })
        .catch((err) => {
            console.log(err);
        });
    
    //проверка вопросов
    let mark_question = new Array();
    let count_right_answers_test = 0;
    let count_all_questions_test = questions_test_from_db.length;
    try {
        for (let i = 0; i < questions_test_from_db.length; i++) {
            let answers = new Array();
            let flag_right_answer = 0;

            let flag = true;
            if (questions_test_from_db[i].interactive) {
                let temp_arr_splite = questions_test_from_db[i].formulation.split("{");
                temp_arr_splite.splice(0, 1);
                temp_arr_splite.forEach((el) => {
                    answers.push(el.split("}")[0]);
                });
                
                let arr_answers = data.questions[i].answer;
                for (let a = 0; a < answers.length; a++) {
                    if (answers[a] != arr_answers[a]) {
                        flag = false;
                    }
                }
            } else {
                let arr_ranswers = JSON.parse(questions_test_from_db[i].rightAnswer);
                for (let a = 0; a < arr_ranswers.length; a++) {
                    if (arr_ranswers[a] != data.questions[i].answer[a]) {
                        flag = false;
                    }
                }
            }

            if (flag) {
                flag_right_answer = 1;
                count_right_answers_test++;
            }

            mark_question.push({
                login: verify[0].login,
                idquestions: questions_test_from_db[i].idquestions,
                tryCount: last_try + 1,
                answer: JSON.stringify(answers),
                right: flag_right_answer
            });
        }
    } catch (e) {
        return response.status(801).send("Ошибка при проверке теста");
    }

    //сохранение результатов теста
    let flag_error_add_marks_test = "";
    await marks_tests.addMarks_tests(verify[0].login, data.id_test, last_try + 1, Math.round(count_right_answers_test * 100 / count_all_questions_test))
        .catch((err) => {
            console.log(err);
            flag_error_add_marks_test = "Ошибка при сохранении результатов теста";
        });
    
    //сохранение результатов вопросов
    let flag_error_add_marks_questions = "";
    for (let i = 0; i < mark_question.length; i++) {
        await marks_questions.addMarks_questions(verify[0].login, mark_question[i].idquestions, last_try+1, mark_question[i].answer, mark_question[i].right)
        .catch((err) => {
            console.log(err);
            flag_error_add_marks_questions = "Ошибка при сохранении результатов вопросов";
        });
    }

    if (flag_error_add_marks_test || flag_error_add_marks_questions) {
        return response.status(801).send(flag_error_add_marks_test +"\n"+flag_error_add_marks_questions);
    } else {
        return response.status(200).send("Тест проверен, данные успешно сохранены!\nРезультаты можно увидеть на странице с тестами");
    }
}

//раздел группа
exports.new_group = async (request, response) => {
    let data = request.body;
    console.log(data);

    let verify = await check_user(data.token);
    if (!verify[0]) {
        return response.status(801).send("Ошибка в авторизации пользователя!");
    }

    let flag_add_group;
    await groups.addGroups(data.shifr)
        .then((res) => {
            flag_add_group = res[0].affectedRows;
        })
        .catch((err) => {
            console.log(err);
            flag_add_group = false;
        });
    
    if ((flag_add_group == 0) || (flag_add_group == false)) {
        return response.status(801).send("Ошибка при добавлении группы!");
    }
    return response.status(200).send("Группа успешно добавлена!");
}
exports.update_group = async (request, response) => {
    let data = request.body;
    console.log(data);

    let verify = await check_user(data.token);
    if (!verify[0]) {
        return response.status(801).send("Ошибка в авторизации пользователя!");
    }

    let flag_update_group;
    await groups.updateGroups(data.id, data.shifr)
        .then((res) => {
            flag_update_group = res[0].affectedRows;
        })
        .catch((err) => {
            console.log(err);
            flag_update_group = false;
        });
    
    if ((flag_update_group == 0) || (flag_update_group == false)) {
        return response.status(801).send("Ошибка при изменении группы!");
    }
    return response.status(200).send("Шифр группы успешно изменен!");
}
exports.del_group = async (request, response) => {
    let data = request.body;
    console.log(data);

    let verify = await check_user(data.token);
    
    if (!verify[0]) {
        return response.status(801).send("Ошибка в авторизации пользователя!");
    }

    await groups.delGroups(data.id)
        .then((res) => {
            if (res[0].affectedRows > 0) {
                response.status(200).send("Группа успешно удалена!");
            } else {
                response.status(801).send("Ошибка при удалении группы");
            }
        })
        .catch((err) => {
            console.log(err);
            response.status(801).send("Ошибка при удалении группы");
        });
}

//раздел группа-тест
exports.del_group_test = async (request, response) => {
    let data = request.body;
    console.log(data);

    let verify = await check_user(data.token);

    if (!verify[0]) {
        return response.status(801).send("Ошибка в авторизации пользователя!");
    }

    await groups_tests.delGroups_tests(data.id)
        .then((res) => {
            if (res[0].affectedRows > 0) {
                response.status(200).send("Тест успешно удален!");
            } else {
                response.status(801).send("Ошибка при удалении теста");
            }
        })
        .catch((err) => {
            console.log(err);
            response.status(801).send("Ошибка при удалении теста");
        });
}
exports.new_group_test = async (request, response) => {
    let data = request.body;
    console.log(data);

    let verify = await check_user(data.token);

    if (!verify[0]) {
        return response.status(801).send("Ошибка в авторизации пользователя!");
    }

    await groups_tests.addGroups_tests(data.id_group, data.id_test)
        .then((res) => {
            if (res[0].affectedRows > 0) {
                response.status(200).send("Тест успешно прикреплен!");
            } else {
                response.status(801).send("Ошибка при прикреплении теста");
            }
        })
        .catch((err) => {
            console.log(err);
            response.status(801).send("Ошибка при прикреплении теста");
        });
}


function sqlIniect(data) {
    let flag = false;
    let dataArr = Object.values(data);

    dataArr.forEach(el => {
        el = el.toString();
        if (el.toLowerCase().includes("select") ||
            el.toLowerCase().includes("where")  ||
            el.toLowerCase().includes("from")   ||
            el.toLowerCase().includes("insert") ||
            el.toLowerCase().includes("delete") ||
            el.toLowerCase().includes("drop")   ||
            el.toLowerCase().includes("table")  ||
            el.toLowerCase().includes("alter")  ||
            el.toLowerCase().includes("into")
        ) {
            flag = true;
        }
    });
    
    return flag;
}

function get_max_idtests(data) {
    let max = -1;
    for (let i = 0; i < data.length; i++){
        if (data[i].idtests > max) {
            max = data[i].idtests;
        }
    }
    return max;
}

async function check_user(token) {
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

