const path = require('path');
const pathDir = path.dirname(__dirname);
const jwt = require("jsonwebtoken");

const users = require("../models/users");
const get_data = require("../models/get_data");

exports.login = (request, response) => {
    let cookieUser = getCookie(request.rawHeaders);

    if ((cookieUser != "") && (cookieUser != "false")) {
        response.redirect("/");
    } else {
        response.render(pathDir + "/views/login.hbs",
            {
                title: "Основы SQL",
                page: "login",
                view: false
            }
        );
    }
}

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
        breadcrumb.push({
            title: "Главная",
            href: "/",
            active: "active"
        })

        response.render(pathDir + "/views/main.hbs",
            {
                title: "Основы SQL",
                headPage: 'Образовательная система "Основы SQL"',
                userName: user.login,
                page: "main",
                viewHeader: true,
                student: flagStudent,
                lecturer: flagLecturer,
                admin: flagAdmin,
                breadcrumb: breadcrumb
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