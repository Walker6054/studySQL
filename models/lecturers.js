const connect = require("./.connectDB");

exports.allLecturers = () => {
    return connect.query("SELECT * from lecturers");
}

exports.lecturers = (id) => {
    return connect.query("SELECT * from lecturers where idlecturers = " + id);
}

exports.addLecturers = (login, password, f, i , o, institute) => {
    return connect.query("call add_lecturers('"+ login + "', '"+ password + "', '"+ f + "', '"+ i + "', '"+ o + "', '"+ institute +"')");
}

exports.updateLecturers = (id, login, password, f, i , o, institute) => {
    return connect.query("call update_lecturers("+ id +", '" + login + "', '"+ password + "', '"+ f + "', '"+ i + "', '"+ o + "', '"+ institute +"')");
}

exports.delLecturers = (id) => {
    return connect.query("call del_lecturers("+ id +")");
}