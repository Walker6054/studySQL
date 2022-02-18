const path = require('path');
const pathDir = path.dirname(__dirname);
const jwt = require("jsonwebtoken");

const users = require("../models/users");

exports.login = (request, response) => {
    let cookieUser = getCookie(request.rawHeaders);
    response.render(pathDir + "/views/login.hbs",
        {
            title: "Основы SQL",
            page: "login",
            view: false
        }
    );
}

exports.index = (request, response) => {
    let cookieUser = getCookie(request.rawHeaders);

    if ((cookieUser != "")&&(cookieUser != "false")) {
        checkToken(cookieUser)
            .then((user) => {
                response.render(pathDir + "/views/main.hbs",
                    {
                        title: "Основы SQL",
                        headPage: 'Образовательная системаа "Основы SQL"',
                        userName: user.login,
                        page: "main",
                        viewHeader: true
                    }
                );
            })
            .catch((err) => {
                console.log(err);
            });
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