const connect = require("./.connectDB");

exports.allAdmins = () => {
    return connect.query("SELECT * from admins");
}

exports.admins = (id) => {
    return connect.query("SELECT * from admins where idadmins = " + id);
}

exports.addAdmins = (login, pass) => {
    return connect.query("call add_admins('" + login + "', '" + pass + "')");
}

exports.updateAdmins = (id, login, pass) => {
    return connect.query("call update_admins("+id+", '" + login + "', '" + pass + "')");
}

exports.delAdmins = (id) => {
    return connect.query("call del_admins(" + id + ")");
}