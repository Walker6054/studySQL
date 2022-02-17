const connectDB = require("../models/.connectDB");
const jwt = require("jsonwebtoken");

const users = require("../models/users");

exports.reguser = function (request, response) {
    let data = request.body;
    let sqlIn = sqlIniect(data);
    if (sqlIn) {
        response.status(800).send("Попытка SQL-инъекции!");
    } else {
        let user = new UserReg(data["login"], data["password"]);
        user.alreadyExistInDB(user.getLogin());
        setTimeout(() => {
            if (user.getExists()) {
                response.status(801).send("Данный пользователь уже существует!");
            } else {
                response.status(200).send(user.getToken());
            }
        }, 1000);
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
        console.log(exists);

        console.log((exists != undefined) & ((data.login == exists.login)||(data.login == exists.email)) & (data.password == exists.password));
        if ((exists != undefined) & ((data.login == exists.login)||(data.login == exists.email)) & (data.password == exists.password)) {
            let token = jwt.sign({
                login: exists.login,
                email: exists.email
            }, exists.idusers.toString())

            response.status(200).send(token);
        } else {
            response.status(801).send("Пользователь с таким логином и паролем не существует! Проверьте правильность введенных данных!");
        }
    }
}


function sqlIniect(data) {
    if (data["login"].toLowerCase().includes("select") ||  data["password"].toLowerCase().includes("select") || 
        data["login"].toLowerCase().includes("where")  ||  data["password"].toLowerCase().includes("where")  ||
        data["login"].toLowerCase().includes("from")   ||  data["password"].toLowerCase().includes("from")   ||
        data["login"].toLowerCase().includes("insert") ||  data["password"].toLowerCase().includes("insert") ||
        data["login"].toLowerCase().includes("delete") ||  data["password"].toLowerCase().includes("delete") ||
        data["login"].toLowerCase().includes("drop")   ||  data["password"].toLowerCase().includes("drop")   ||
        data["login"].toLowerCase().includes("table")  ||  data["password"].toLowerCase().includes("table")  ||
        data["login"].toLowerCase().includes("alter")  ||  data["password"].toLowerCase().includes("alter")  ||
        data["login"].toLowerCase().includes("into")   ||  data["password"].toLowerCase().includes("into")
    ) return (true);
    else return (false);
}