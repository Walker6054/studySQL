const jwt = require("jsonwebtoken");

const users = require("../models/users/users");
const students = require("../models/users/students");
const admins = require("../models/users/admin");
const lecturers = require("../models/users/lecturers");

const tests = require("../models/tables/tests");
const questions = require("../models/tables/questions");
const groups_tests = require("../models/relations/groups_tests");
const get_data = require("../models/get_data");

const mailer = require("../mailer/mailer");

//авторизация/регистрация/восстановление пароля + изменение данных в ЛК
exports.reguser = async (request, response) => {
    let data = request.body;
    let sqlIn = sqlIniect(data);

    if (sqlIn) {
        response.status(800).send("Попытка SQL-инъекции!");
    } else {
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
                    response.status(800).send("Пользователь с таким "+type_err+" уже существует!");
                } else {
                    let user;
                    await users.users(data.login)
                        .then((res) => {
                            user = res[0][0][0];
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    let token = jwt.sign({
                        login: user.login,
                        email: user.email
                    }, user.idusers.toString());

                    mailer.sendMail(user.email, user.login, "reg");
                    response.status(200).send(token);
                }
                break;
            
            case "lect":
                let responseDbLect;
                await lecturers.addLecturers(data.login, data.pass, data.email, data.f, data.i, data.o, data.inst)
                    .catch((err) => {
                        console.log(err);
                        responseDbLect = err;
                    })
                if (responseDbLect) {
                    type_err = responseDbLect.message.split(".")[1].split("_")[0];
                    response.status(800).send("Пользователь с таким "+type_err+" уже существует!");
                } else {
                    let user;
                    await users.users(data.login)
                        .then((res) => {
                            user = res[0][0][0];
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    let token = jwt.sign({
                        login: user.login,
                        email: user.email
                    }, user.idusers.toString());

                    mailer.sendMail(user.email, user.login, "reg");
                    response.status(200).send(token);
                }
                break;
        }
    }
}
exports.loguser = async (request, response) => {
    let data = request.body;
    console.log(data);
    let sqlIn = sqlIniect(data);

    if (sqlIn) {
        response.status(800).send("Попытка SQL-инъекции!");
    } else {
        let exists;
        await users.users(data.login)
            .then((res) => {
                exists = res[0][0][0];
            })
            .catch((err) => {
                console.log(err);
            })

        if (exists) {
            if (((data.login == exists.login)||(data.login == exists.email)) && (data.pass == exists.password)) {
                let token = jwt.sign({
                    login: exists.login,
                    email: exists.email
                }, exists.idusers.toString())

                response.status(200).send(token);
            } else {
                response.status(801).send("Пользователь с таким логином и паролем не существует! Проверьте правильность введенных данных!");
            }
        } else {
            response.status(801).send("Пользователь с таким логином и паролем не существует! Проверьте правильность введенных данных!");
        }
    }
}
exports.forgotpass = async (request, response) => {
    let data = request.body;
    console.log(data);
    let sqlIn = sqlIniect(data);

    if (sqlIn) {
        response.status(800).send("Попытка SQL-инъекции!");
    } else {
        let exists;
        await users.users(data.login)
            .then((res) => {
                exists = res[0][0][0];
            })
            .catch((err) => {
                console.log(err);
            })

        if (exists) {
            if ((data.login == exists.login)||(data.login == exists.email)) {
                let token = jwt.sign({
                    type: "Восстановление пароля",
                    login: exists.login,
                    email: exists.email
                }, exists.idusers.toString());

                await mailer.sendMail(exists.email, exists.login, "forgot", '<a href="http://localhost:3000/registration/recoveryPass=' + token + '">')
                    .then((res) => {
                        switch (res) {
                            case true:
                                response.status(200).send("Письмо с дальнейшими инструкциями выслано на почтовый ящик, указанный при регистрации!");
                                break;
                            case false:
                                response.status(801).send("Произошла ошибка при отправке письма!");
                                break;
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                response.status(801).send("Пользователь с таким логином или email не существует! Проверьте правильность введенных данных!");
            }
        } else {
            response.status(801).send("Пользователь с таким логином или email не существует! Проверьте правильность введенных данных!");
        }
    }
}
exports.recoverypass = async (request, response) => {
    let data = request.body;
    console.log(data);
    let sqlIn = sqlIniect(data);

    if (sqlIn) {
        response.status(800).send("Попытка SQL-инъекции!");
    } else {
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
            console.log(checkUser);
            if (exists && checkUser) {
                await users.updateUsers(exists.idusers, exists.login, data.pass, exists.email)
                    .then((res) => {
                        console.log(res);
                        response.status(200).send("Пароль успешно изменен!");
                        mailer.sendMail(exists.email, exists.login, "rec");
                    })
                    .catch((err) => {
                        console.log(err);
                        response.status(801).send("Ошибка при изменении пароля!");
                    });
            } else {
                response.status(801).send("Попытка подмены токена!");
            }
        } catch (err) {
            console.log(err);
            response.status(801).send("Попытка подмены токена!");
        }
        
    }
}
exports.update_user = async (request, response) => {
    let data = request.body;
    console.log(data);

    let sqlIn = sqlIniect(data);

    if (sqlIn) {
        response.status(800).send("Попытка SQL-инъекции!");
    } else {
        let verify = await check_user(data.token)
            .catch((err) => {
                console.log(err);
            })
        
        if (verify[0]) {
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

        } else {
            response.status(801).send("Ошибка верификации пользователя!");
        }        
    }
}

//раздел тестов
exports.del_test = async (request, response) => {
    let data = request.body;
    console.log(data);

    let verify = await check_user(data.token);
    console.log(verify);
    if (verify[0]) {
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
    } else {
        response.status(801).send("Ошибка в авторизации пользователя!");
    }
}
exports.update_test = async (request, response) => {
    let data = request.body;
    console.log(data);

    let verify = await check_user(data.token);
    if (verify[0]) {
        let flag_add_test;
        await tests.updateTests(Number(data.id), data.name, data.desc, data.maxTry)
            .then((res) => {
                flag_add_test = res[0].affectedRows;
            })
            .catch((err) => {
                console.log(err);
                flag_add_test = false;
            });
        
        if ((flag_add_test != 0) && (flag_add_test != false)) {

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
                response.status(200).send("Тест успешно изменен!");
            } else {
                response.status(801).send("Ошибка при добавлении одного из вопросов!");
            }
        } else {
            response.status(801).send("Ошибка при изменении теста!");
        }
    } else {
        response.status(801).send("Ошибка в авторизации пользователя!");
    }
}
exports.new_test = async (request, response) => {
    let data = request.body;
    console.log(data);

    let verify = await check_user(data.token);
    if (verify[0]) {
        let flag_add_test;
        await tests.addTests(verify[0].login, data.name, data.desc, data.maxTry)
            .then((res) => {
                flag_add_test = res[0].affectedRows;
            })
            .catch((err) => {
                console.log(err);
                flag_add_test = false;
            });
        
        if ((flag_add_test != 0) && (flag_add_test != false)) {
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
                //попробовать потом исправить конструкцию
                rightAnswers.forEach((el) => {
                    el = Number(el) - 1;
                })

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
                response.status(200).send("Тест успешно добавлен!");
            } else {
                response.status(801).send("Ошибка при добавлении одного из вопросов!");
            }
        } else {
            response.status(801).send("Ошибка при добавлении теста!");
        }
    } else {
        response.status(801).send("Ошибка в авторизации пользователя!");
    }
}

//раздел группа-тест
exports.del_group_test = async (request, response) => {
    let data = request.body;
    console.log(data);

    let verify = await check_user(data.token);

    if (verify[0]) {
        await groups_tests.delGroups_tests(data.id)
            .then((res) => {
                console.log(res);
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
    } else {
        response.status(801).send("Ошибка в авторизации пользователя!");
    }
}
exports.new_group_test = async (request, response) => {
    let data = request.body;
    //console.log(data);

    let verify = await check_user(data.token);

    if (verify[0]) {
        await groups_tests.addGroups_tests(data.id_group, data.id_test)
            .then((res) => {
                //console.log(res);
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
    } else {
        response.status(801).send("Ошибка в авторизации пользователя!");
    }
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
                user_checked[1] = Object.values(res[0][0])[0];
            })
            .catch((err) => {
                console.log(err);
            })
    }
    return user_checked;
}

