const path = require('path');
const pathDir = path.dirname(__dirname);
const jwt = require("jsonwebtoken");

const users = require("../models/users/users");
const students = require("../models/users/students");
const lecturers = require("../models/users/lecturers");
const admin = require("../models/users/admin");
const get_data = require("../models/get_data");

exports.login = async (request, response) => {
    let verify = await get_cookie_check_user(request.rawHeaders);

    if (verify[0]) {
        response.redirect("/");
    } else {
        response.render(pathDir + "/views/login.hbs",
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

    if (verify[0]) {
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

        response.render(pathDir + "/views/main.hbs",
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
    } else {
        response.redirect("/login");
    }
};

exports.lk = async (request, response) => {
    let verify = await get_cookie_check_user(request.rawHeaders);
    
    //инициализация пути
    let breadcrumb = Array();
    breadcrumb.push({ title: "Главная", href: "", active: false });
    breadcrumb.push({ title: "ЛК", href: "/lk", active: true });

    if (verify[0]) {
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
                response.render(pathDir + "/views/lk.hbs",
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
                response.render(pathDir + "/views/lk.hbs",
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
                response.render(pathDir + "/views/lk.hbs",
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