const path = require('path');
const pathDir = path.dirname(__dirname);
const jwt = require("jsonwebtoken");

const users = require("../models/users/users");
const students = require("../models/users/students");
const lecturers = require("../models/users/lecturers");
const admin = require("../models/users/admin");
const get_data = require("../models/get_data");
const connect = require("../models/.connectDB");

exports.login = async (request, response) => {
    let verify = await get_cookie_check_user(request.rawHeaders);

    if (verify[0]) {
        return response.redirect("/");
    } else {
        return response.render(pathDir + "/views/login.hbs",
            {
                title: "Основы SQL",
                page: "login/login",
                view: false
            }
        );
    }
}

exports.index = async (request, response) => {
    let verify = await get_cookie_check_user(request.rawHeaders);

    if (!verify[0]) {
        return response.redirect("/login");
    }

    let flagUser = Array();
    switch (verify[1]) {
        case "student":
            flagUser[0] = true;
            break;
        case "lecturer":
            flagUser[1] = true;
            break;
        case "admin":
            flagUser[2] = true;
            break;
    }

    //инициализация пути
    let breadcrumb = Array();
    breadcrumb.push({ title: "Главная", href: "", active: true });

    return response.render(pathDir + "/views/main.hbs",
        {
            title: "Основы SQL",
            headPage: 'Образовательная система "Основы SQL"',
            userName: verify[0].login,
            page: "main",
            viewHeader: true,
            student: flagUser[0],
            lecturer: flagUser[1],
            admin: flagUser[2],
            breadcrumb: breadcrumb
        }
    );
};

exports.lk = async (request, response) => {
    let verify = await get_cookie_check_user(request.rawHeaders);
    
    //инициализация пути
    let breadcrumb = Array();
    breadcrumb.push({ title: "Главная", href: "", active: false });
    breadcrumb.push({ title: "ЛК", href: "/lk", active: true });

    if (!verify[0]) {
        return response.redirect("/login");
    }

    switch (verify[1]) {
        case "student":
            let student_info;
            await students.students(verify[0].login)
                .then((res) => {
                    console.log(res);
                    student_info = res[0][0][0];
                })
                .catch((err) => {
                    console.log(err);
                })
            return response.render(pathDir + "/views/lk.hbs",
                {
                    title: "Основы SQL",
                    headPage: 'Образовательная система "Основы SQL"',
                    userName: verify[0].login,
                    page: "lk/lk_stud",
                    viewHeader: true,
                    student: true,
                    student_info: student_info,
                    breadcrumb: breadcrumb,
                    lk: "hidden",
                    type: verify[1]
                }
            );

            break;
        
        case "lecturer":
            let lect_info;
            await lecturers.lecturers(verify[0].login)
                .then((res) => {
                    lect_info = res[0][0][0];
                })
                .catch((err) => {
                    console.log(err);
                })
            return response.render(pathDir + "/views/lk.hbs",
                {
                    title: "Основы SQL",
                    headPage: 'Образовательная система "Основы SQL"',
                    userName: verify[0].login,
                    page: "lk/lk_lect",
                    viewHeader: true,
                    lecturer: true,
                    lect_info: lect_info,
                    breadcrumb: breadcrumb,
                    lk: "hidden",
                    type: verify[1]
                }
            );
            break;
        
        case "admin":
            let admin_info;
            await admin.admins(verify[0].login)
                .then((res) => {
                    admin_info = res[0][0][0];
                })
                .catch((err) => {
                    console.log(err);
                })
            return response.render(pathDir + "/views/lk.hbs",
                {
                    title: "Основы SQL",
                    headPage: 'Образовательная система "Основы SQL"',
                    userName: verify[0].login,
                    page: "lk/lk_adm",
                    viewHeader: true,
                    admin: true,
                    admin_info: admin_info,
                    breadcrumb: breadcrumb,
                    lk : "hidden",
                    type: verify[1]
                }
            );
            break;
    }
};

exports.error_404 = (request, response) => {
    return response.render(pathDir + "/views/404.hbs",
        {
            title: "Страница не найдена",
            page: "404",
            viewHeader: false
        }
    );
};

exports.error_db = (request, response) => {
    return response.render(pathDir + "/views/error_db.hbs",
        {
            title: "База данных недоступна",
            page: "error_db",
            viewHeader: false
        }
    );
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
                connect.end();
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
                connect.end();
            })
            .catch((err) => {
                console.log(err);
            })
    }
    return user_checked;
}