const path = require('path');
const pathDir = path.dirname(__dirname);

//получение записи локального хранилища
let tokenUser;
exports.localstorage = function (request, response) {
    let data = request.body;
    if (data.exist) {
        tokenUser = data.data;
    } else {
        tokenUser = "undef_not_EXIST";
    }
    response.status(200).send("allIsOk");
}

exports.index = async (request, response) => {

    let cookieUser = getCookie(request.rawHeaders);
    let userName = "Гаськов";
    let authCheck = false;

    response.render(pathDir + "/views/main.hbs",
        {
            auth: true,
            title: "Основы SQL",
            headPage: 'Образовательная системаа "Основы SQL"',
            userName: userName,
            page: "main"
        }
    );
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