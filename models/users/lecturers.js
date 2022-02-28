const connect = require("../.connectDB");

//список всех преподавателей
exports.allLecturers = () => {
    return connect.query("SELECT * from lecturers");
}

//информация о преподавателе по логину
exports.lecturers = (login) => {
    return connect.query("call get_lecturers('"+ login + "')");
}

//информация о преподавателе по id
exports.get_info_lecturer = (id) => {
    return connect.query("call get_info_lecturer("+ id + ")");
}

//возвращение id преподавателя
exports.id_lecturers = (login) => {
    return connect.query("call get_id_lecturers('"+ login + "')");
}

//процедура добавления преподавателя
exports.addLecturers = (login, password, email, f, i , o, institute) => {
    return connect.query("call add_lecturers('"+ login + "', '"+ password + "', '"+ email + "', '"+ f + "', '"+ i + "', '"+ o + "', '"+ institute +"')");
}

//процедура обновления преподавателя
exports.updateLecturers = (id, login, email, f, i , o, institute) => {
    return connect.query("call update_lecturers("+ id +", '" + login + "', '"+ email + "', '"+ f + "', '"+ i + "', '"+ o + "', '"+ institute +"')");
}

//процедура обновления ЛК преподавателя
exports.lk_updateLecturers = (id, password, email, f, i , o, institute) => {
    return connect.query("call lk_update_lecturers("+ id +", '" + password + "', '"+ email + "', '"+ f + "', '"+ i + "', '"+ o + "', '"+ institute +"')");
}

//процедура удаления преподавателя
exports.delLecturers = (id) => {
    return connect.query("call del_lecturers("+ id +")");
}

//функция проверки теста на принадлежность преподавателю
exports.check_lecturer_test = (login, idtest) => {
    return connect.query("select check_lecturer_test('" + login + "', " + idtest + ")");
}

