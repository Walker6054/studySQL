const path = require('path');
const pathDir = path.dirname(__dirname);
const jwt = require("jsonwebtoken");

const users = require("../models/users/users");
const lecturers = require('../models/users/lecturers');
const groups = require('../models/tables/groups');
const get_data = require("../models/get_data");

const hbs_helpers = require("../hbs_helpers/helpers");

exports.index = async (request, response) => {
    let verify = await get_cookie_check_user(request.rawHeaders);

    //инициализация пути
    let breadcrumb = Array();
    breadcrumb.push({ title: "Главная", href: "", active: false });
    breadcrumb.push({ title: "Преподаватели", href: "/lecturers", active: true });

    if (!verify[0]) {
        return response.redirect("/login");
    }
    
    switch (verify[1]) {
        case "student":
            return response.redirect("/");
            break;
        
        case "lecturer":
            return response.redirect("/");
            break;
        
        case "admin":
            let all_lecturers;
            await get_data.all_get_lecturers()
                .then((res) => {
                    all_lecturers = res[0][0];
                })
                .catch((err) => {
                    console.log(err);
                });
            
            return response.render(pathDir + "/views/lecturers/lecturers.hbs",
                {
                    title: "Основы SQL",
                    headPage: 'Образовательная система "Основы SQL"',
                    userName: verify[0].login,
                    page: "lecturers/lecturers",
                    viewHeader: true,
                    breadcrumb: breadcrumb,
                    lecturers: all_lecturers
                }
            );
            break;
    }
};

exports.new_lecturer = async (request, response) => {
    let verify = await get_cookie_check_user(request.rawHeaders);

    //инициализация пути
    let breadcrumb = Array();
    breadcrumb.push({ title: "Главная", href: "", active: false });
    breadcrumb.push({ title: "Преподаватели", href: "/lecturers", active: false });
    breadcrumb.push({ title: "Добавление нового преподаватели", href: "/lecturers/new_lecturer", active: true });

    if (!verify[0]) {
        return response.redirect("/login");
    }
    
    switch (verify[1]) {
        case "student":
            return response.redirect("/");
            break;
        
        case "lecturer":
            return response.redirect("/");
            break;
        
        case "admin":
            return response.render(pathDir + "/views/lecturers/new_lecturer.hbs",
                {
                    title: "Основы SQL",
                    headPage: 'Образовательная система "Основы SQL"',
                    userName: verify[0].login,
                    page: "lecturers/new_lecturer",
                    viewHeader: true,
                    breadcrumb: breadcrumb
                }
            );
            break;
    }
};

exports.update_lecturer = async (request, response) => {
    let verify = await get_cookie_check_user(request.rawHeaders);
    let id_lecturer = request.url.split("=")[1];

    //инициализация пути
    let breadcrumb = Array();
    breadcrumb.push({ title: "Главная", href: "", active: false });
    breadcrumb.push({ title: "Преподаватели", href: "/lecturers", active: false });
    breadcrumb.push({ title: "Изменение нового преподаватели", href: "/lecturers/update_lecturer", active: true });

    if (!verify[0]) {
        return response.redirect("/login");
    }
    
    switch (verify[1]) {
        case "student":
            return response.redirect("/");
            break;
        
        case "lecturer":
            return response.redirect("/");
            break;
        
        case "admin":
            let info_lecturer;
            let error = false;
            await lecturers.get_info_lecturer(id_lecturer)
                .then((res) => {
                    info_lecturer = res[0][0][0];
                })
                .catch((err) => {
                    error = true;
                    console.log(err);
                });
            if (error || !info_lecturer) {
                return response.redirect("/lecturers/");
            }

            let lecturer_groups;
            await get_data.get_lecturers_groups(info_lecturer.login)
                .then((res) => {
                    lecturer_groups = res[0][0];
                })
                .catch((err) => {
                    console.log(err);
                });
            
            let all_groups;
            await groups.allGroups()
                .then((res) => {
                    all_groups = res[0];
                })
                .catch((err) => {
                    console.log(err);
                });
            
            //удаление повторов в массиве всех тестов (для ограничения добавления)
            let add_enable = true;
            for (let i = 0; i < lecturer_groups.length; i++) {
                let index_entry = all_groups.findIndex(el => el.idgroups == lecturer_groups[i].idgroups);
                if (index_entry != -1) {
                    all_groups.splice(index_entry, 1);
                }
            }

            if (all_groups.length == 0) {
                add_enable = false;
            }

            return response.render(pathDir + "/views/lecturers/update_lecturer.hbs",
                {
                    title: "Основы SQL",
                    headPage: 'Образовательная система "Основы SQL"',
                    userName: verify[0].login,
                    page: "lecturers/update_lecturer",
                    viewHeader: true,
                    breadcrumb: breadcrumb,
                    lecturer: info_lecturer,
                    groups: lecturer_groups,
                    all_groups: all_groups,
                    add_enable: add_enable
                }
            );
            break;
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