const path = require('path');
const pathDir = path.dirname(__dirname);
const jwt = require("jsonwebtoken");

const users = require("../models/users/users");
const get_data = require("../models/get_data");

const antlr = require('antlr4');
const Lexer = require('../antlr/SqlBaseLexer');
const Parser = require('../antlr/SqlBaseParser');

exports.index = async (request, response) => {
    let verify = await get_cookie_check_user(request.rawHeaders);

    if (!verify[0]) {
        return response.redirect("/login");
    }

    //инициализация пути
    let breadcrumb = Array();
    breadcrumb.push({ title: "Главная", href: "", active: false });
    breadcrumb.push({ title: "Проверка запроса", href: "/grammar", active: true });

    switch (verify[1]) {
        case "student":
            return response.render(pathDir + "/views/grammar/grammar.hbs",
                {
                    title: "Основы SQL",
                    headPage: 'Образовательная система "Основы SQL"',
                    userName: verify[0].login,
                    page: "grammar/grammar",
                    viewHeader: true,
                    breadcrumb: breadcrumb
                }
            );
            break;
        
        case "lecturer":
            return response.redirect("/");
        
        case "admin":
            return response.redirect("/");
    }
};

exports.check_input_string = async (request, response) => {
    let data = request.body;
    console.log(data);

    let verify = await get_cookie_check_user("", data.token);
    
    if (!verify[0]) {
        return response.status(801).send("Ошибка в авторизации пользователя!");
    }

    let input_stream = new antlr.InputStream(data.input);
    let lexer = new Lexer();
    lexer.removeErrorListeners();
    lexer.addErrorListener({
        syntaxError: (recognizer, offendingSymbol, line, column, msg, err) => {
            console.error(`line ${line}, col ${column}: ${msg.split("expecting")[0]}`);
        }
    });
    lexer.inputStream = input_stream;
    let tokens = new antlr.CommonTokenStream(lexer);

    let parser = new Parser(tokens);
    parser.buildParseTrees = true;
    parser.removeErrorListeners();
    parser.addErrorListener({
        syntaxError: (recognizer, offendingSymbol, line, column, msg, err) => {
            console.error(`line ${line}, col ${column}: ${msg.split("expecting")[0]}`);
        }
    });

    try {
        let result = parser.singleStatement();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
    
    

    response.status(200).send("ОК");
}




async function get_cookie_check_user(req, token_input) {
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
    
    let token = token_input || "";
    for (let i = 0; i < cookies.length; i++){
        if (cookies[i].split("=")[0] == "CookieUser") {
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