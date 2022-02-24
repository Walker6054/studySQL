const connect = require("../.connectDB");

exports.allLecturers = () => {
    return connect.query("SELECT * from lecturers");
}

exports.lecturers = (login) => {
    return connect.query("call get_lecturers('"+ login + "')");
}

exports.id_lecturers = (login) => {
    return connect.query("call get_id_lecturers('"+ login + "')");
}

exports.addLecturers = (login, password, email, f, i , o, institute) => {
    return connect.query("call add_lecturers('"+ login + "', '"+ password + "', '"+ email + "', '"+ f + "', '"+ i + "', '"+ o + "', '"+ institute +"')");
}

exports.updateLecturers = (id, login, password, email, f, i , o, institute) => {
    return connect.query("call update_lecturers("+ id +", '" + login + "', '"+ password + "', '"+ email + "', '"+ f + "', '"+ i + "', '"+ o + "', '"+ institute +"')");
}

exports.lk_updateLecturers = (id, password, email, f, i , o, institute) => {
    return connect.query("call lk_update_lecturers("+ id +", '" + password + "', '"+ email + "', '"+ f + "', '"+ i + "', '"+ o + "', '"+ institute +"')");
}

exports.delLecturers = (id) => {
    return connect.query("call del_lecturers("+ id +")");
}

exports.check_lecturer_test = (login, idtest) => {
    return connect.query("select check_lecturer_test('" + login + "', " + idtest + ")");
}
