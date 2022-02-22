const connect = require("./.connectDB");

exports.allAdmins = () => {
    return connect.query("SELECT * from admins");
}

exports.admins = (login) => {
    return connect.query("call get_admins('"+ login + "')");
}

exports.id_admins = (login) => {
    return connect.query("call get_id_admins('"+ login + "')");
}

exports.addAdmins = (login, pass, email) => {
    return connect.query("call add_admins('" + login + "', '" + pass + "', "+ email +" ')");
}

exports.updateAdmins = (id, login, pass, email) => {
    return connect.query("call update_admins("+id+", '" + login + "', '" + pass + "', '"+ email +"')");
}

exports.lk_updateAdmins = (id, pass, email) => {
    return connect.query("call lk_update_admins("+id + ", '" + pass + "', '"+ email +" ')");
}

exports.delAdmins = (id) => {
    return connect.query("call del_admins(" + id + ")");
}