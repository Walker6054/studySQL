const path = require('path');
const pathDir = path.dirname(__dirname);

//получение записи локального хранилища
let tokenUser;
exports.localstorage = function (request, response) {
    //console.log(request);
    let data = request.body;
    if (data.exist) {
        tokenUser = data.data;
    } else {
        tokenUser = "undef_not_EXIST";
    }
    response.status(200).send("allIsOk");
}

exports.index = async (request, response) => {
    const admins = require("../models/admin");
    
    await admins.admins()
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
    
    let cookieUser = getCookie(request.rawHeaders);
    let userName;
    let authCheck = false;

    if (cookieUser != "true") {
        response.render(pathDir + "/views/main.hbs",
            {
                auth: !authCheck,
                seasons: seasons,
                title: "FamilyGuy Главная страница",
                page: "main"
            }
        );
    } else {
    }
};


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