const connect = require("../.connectDB");

exports.allStudents = () => {
    return connect.query("SELECT * from students");
}

exports.students = (login) => {
    return connect.query("call get_students('"+ login + "')");
}

exports.id_students = (login) => {
    return connect.query("call get_id_students('"+ login + "')");
}

exports.addStudents = (login, email, password, idgroups, f, i, o) => {
    return connect.query("call add_students('"+ login + "', '"+ password + "', '"+ email + "', "+ idgroups + ", '"+ f + "', '"+ i +"', '"+ o +"')");
}

exports.updateStudents = (id, login, password, email, idgroups, f, i, o) => {
    return connect.query("call update_students("+ id + ", '"+ login + "', '"+ password + "', '"+ email + "', "+ idgroups + ", '"+ f + "', '"+ i +"', '"+ o +"')");
}

exports.lk_updateStudents = (id, password, email, f, i, o) => {
    return connect.query("call lk_update_students("+ id + ", '"+ password + "', '"+ email + "', '"+ f + "', '"+ i +"', '"+ o +"')");
}

exports.delStudents= (id) => {
    return connect.query("call del_students("+ id +")");
}