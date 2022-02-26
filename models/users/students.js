const connect = require("../.connectDB");

//список всех студентов
exports.allStudents = () => {
    return connect.query("SELECT * from students");
}

//информация о студенте по логину
exports.students = (login) => {
    return connect.query("call get_students('"+ login + "')");
}

//возвращение id студента
exports.id_students = (login) => {
    return connect.query("call get_id_students('"+ login + "')");
}

//процедура добавления студента
exports.addStudents = (login, email, password, idgroups, f, i, o) => {
    return connect.query("call add_students('"+ login + "', '"+ password + "', '"+ email + "', "+ idgroups + ", '"+ f + "', '"+ i +"', '"+ o +"')");
}

//процедура обновления студента
exports.updateStudents = (id, login, password, email, idgroups, f, i, o) => {
    return connect.query("call update_students("+ id + ", '"+ login + "', '"+ password + "', '"+ email + "', "+ idgroups + ", '"+ f + "', '"+ i +"', '"+ o +"')");
}

//процедура обновления ЛК студента
exports.lk_updateStudents = (id, password, email, f, i, o) => {
    return connect.query("call lk_update_students("+ id + ", '"+ password + "', '"+ email + "', '"+ f + "', '"+ i +"', '"+ o +"')");
}

//процедура удаления студента
exports.delStudents = (id) => {
    return connect.query("call del_students("+ id +")");
}

//получение всех тестов студента (не)пройденных
exports.get_student_tests = (login) => {
    return connect.query("call get_student_tests('"+ login +"')");
}

//получение определенного теста студента (необходимо для проверки на существование/прикрепленность)
exports.get_student_test = (login, idtest) => {
    return connect.query("call get_student_test('"+ login +"', " + idtest + ")");
}

//получение всех результатов тестов студента (не)пройденных до конца
exports.get_result_student_test_with_answers = (login, idtest) => {
    return connect.query("call get_result_student_test_with_answers('"+ login +"', " + idtest + ")");
}