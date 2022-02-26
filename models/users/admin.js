const connect = require("../.connectDB");

//список всех админов
exports.allAdmins = () => {
    return connect.query("SELECT * from admins");
}

//информация о админе по логину
exports.admins = (login) => {
    return connect.query("call get_admins('"+ login + "')");
}

//возвращение id админа
exports.id_admins = (login) => {
    return connect.query("call get_id_admins('"+ login + "')");
}

//процедура добавления админа
exports.addAdmins = (login, pass, email) => {
    return connect.query("call add_admins('" + login + "', '" + pass + "', "+ email +" ')");
}

//процедура обновления админа
exports.updateAdmins = (id, login, pass, email) => {
    return connect.query("call update_admins("+id+", '" + login + "', '" + pass + "', '"+ email +"')");
}

//процедура обновления ЛК админа
exports.lk_updateAdmins = (id, pass, email) => {
    return connect.query("call lk_update_admins("+id + ", '" + pass + "', '"+ email +" ')");
}

//процедура удаления админа
exports.delAdmins = (id) => {
    return connect.query("call del_admins(" + id + ")");
}