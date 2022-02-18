const connect = require("./.connectDB");

exports.allLecturers = () => {
    return connect.query("SELECT * from lecturers");
}

exports.lecturers = (login) => {
    return connect.query("call get_lecturers('"+ login + "')");
}

exports.addLecturers = (login, password, email, f, i , o, institute) => {
    return connect.query("call add_lecturers('"+ login + "', '"+ password + "', '"+ email + "', '"+ f + "', '"+ i + "', '"+ o + "', '"+ institute +"')");
}

exports.updateLecturers = (id, login, password, email, f, i , o, institute) => {
    return connect.query("call update_lecturers("+ id +", '" + login + "', '"+ password + "', '"+ email + "', '"+ f + "', '"+ i + "', '"+ o + "', '"+ institute +"')");
}

exports.delLecturers = (id) => {
    return connect.query("call del_lecturers("+ id +")");
}