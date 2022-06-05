const path = require('path');
const pathDir = path.dirname(__dirname);
const jwt = require("jsonwebtoken");

const users = require('../models/users/users');
const students = require('../models/users/students');
const groups = require('../models/tables/groups');
const get_data = require("../models/get_data");

const hbs_helpers = require("../hbs_helpers/helpers");

exports.index = async (request, response) => {
    let verify = await get_cookie_check_user(request.rawHeaders);

    //инициализация пути
    let breadcrumb = Array();
    breadcrumb.push({ title: "Главная", href: "", active: false });
    breadcrumb.push({ title: "Студенты", href: "/students", active: true });

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
            let group_list;
            let students;
            let flag;
            let group;

            await groups.allGroups()
                .then((res) => {
                    group_list = res[0];
                })
                .catch((err) => {
                    console.log(err);
                });
            
            if (request.query.id) {
                flag = false;
                await groups.get_students_group(request.query.id)
                    .then((res) => {
                        students = res[0][0];
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                if (students.length == 0) {
                    return response.redirect("/students/");
                }

                let index;
                for (let i = 0; i < group_list.length; i++) {
                    if (group_list[i].idgroups == request.query.id) {
                        index = i;
                        group = group_list[i].shifr;
                    }
                }
                group_list.splice(index, 1);
            } else {
                flag = true;
                await get_data.all_get_students()
                    .then((res) => {
                        students = res[0][0];
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            
            return response.render(pathDir + "/views/students/students.hbs",
                {
                    title: "Основы SQL",
                    headPage: 'Образовательная система "Основы SQL"',
                    userName: verify[0].login,
                    page: "students/students",
                    viewHeader: true,
                    breadcrumb: breadcrumb,
                    students: students,
                    groups: group_list,
                    group: group,
                    flag: flag
                }
            );
            break;
    }
};

exports.new_student = async (request, response) => {
    let verify = await get_cookie_check_user(request.rawHeaders);

    //инициализация пути
    let breadcrumb = Array();
    breadcrumb.push({ title: "Главная", href: "", active: false });
    breadcrumb.push({ title: "Студенты", href: "/students", active: false });
    breadcrumb.push({ title: "Добавление нового студента", href: "/students/new_student", active: true });

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
            let all_groups;
            await groups.allGroups()
                .then((res) => {
                    all_groups = res[0];
                })
                .catch((err) => {
                    console.log(err);
                })
            return response.render(pathDir + "/views/students/new_student.hbs",
                {
                    title: "Основы SQL",
                    headPage: 'Образовательная система "Основы SQL"',
                    userName: verify[0].login,
                    page: "students/new_student",
                    viewHeader: true,
                    breadcrumb: breadcrumb,
                    groups: all_groups
                }
            );
            break;
    }
};

exports.update_student = async (request, response) => {
    let verify = await get_cookie_check_user(request.rawHeaders);
    let id_student = request.query.id;

    //инициализация пути
    let breadcrumb = Array();
    breadcrumb.push({ title: "Главная", href: "", active: false });
    breadcrumb.push({ title: "Студенты", href: "/students", active: false });
    breadcrumb.push({ title: "Изменение данных студента", href: "/students/update_student", active: true });

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
            let info_student;
            let error = false;
            await students.get_info_student(id_student)
                .then((res) => {
                    info_student = res[0][0][0];
                })
                .catch((err) => {
                    error = true;
                    console.log(err);
                });
            if (error || !info_student) {
                return response.redirect("/students/");
            }
            
            let all_groups;
            await groups.allGroups()
                .then((res) => {
                    all_groups = res[0];
                })
                .catch((err) => {
                    console.log(err);
                });
            
            let index_group = all_groups.findIndex(item => item.idgroups == info_student.idgroups);
            all_groups.splice(index_group, 1);
            
            return response.render(pathDir + "/views/students/update_student.hbs",
                {
                    title: "Основы SQL",
                    headPage: 'Образовательная система "Основы SQL"',
                    userName: verify[0].login,
                    page: "students/update_student",
                    viewHeader: true,
                    breadcrumb: breadcrumb,
                    student: info_student,
                    groups: all_groups
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

    let cookies;
    try {
        cookies = cookiesString.split("; ");
    } catch (e) {
        cookies = "";
    }
    
    let token = "";
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