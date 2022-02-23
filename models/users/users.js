const connect = require("../.connectDB");

exports.allUsers = () => {
    return connect.query("SELECT * from users");
}

exports.users = (login) => {
    return connect.query("call get_users('"+ login + "')");
}

exports.addUsers = (login, pass, email) => {
    return connect.query("call add_users('" + login + "', '" + pass + "', '"+ email +"')");
}

exports.updateUsers = (id, login, pass, email) => {
    return connect.query("call update_users("+id+", '" + login + "', '" + pass + "', '"+ email +"')");
}

exports.delUsers = (id) => {
    return connect.query("call del_users(" + id + ")");
}