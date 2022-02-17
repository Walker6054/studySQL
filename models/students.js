const connect = require("./.connectDB");

exports.allStudents = () => {
    return connect.query("SELECT * from students");
}

exports.students = (login) => {
    return connect.query("call get_students('"+ login + "')");
}

exports.addStudents = (login, email, password, shifr, f, i, o) => {
    return connect.query("call add_students('"+ login + "', '"+ email + "', '"+ password + "', '"+ shifr + "', '"+ f + "', "+ i +", '"+ o +"')");
}

exports.updateStudents = (id, login, email, password, shifr, f, i, o) => {
    return connect.query("call update_students("+ id + ", '"+ login + "', '"+ email + "', '"+ password + "', '"+ shifr + "', '"+ f + "', "+ i +", '"+ o +"')");
}

exports.delStudents= (id) => {
    return connect.query("call del_students("+ id +")");
}