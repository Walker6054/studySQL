const jwt = require("jsonwebtoken");
const users = require("../models/users");
const students = require("../models/students");
const lecturers = require("../models/lecturers");
const mailer = require("../mailer/mailer");

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

                await mailer.sendMail(exists.email, exists.login, "forgot", "localhost:3000/registration/recoveryPass=" + token)
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


function sqlIniect(data) {
    let flag = false;
    let dataArr = Object.values(data);

    dataArr.forEach(el => {
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