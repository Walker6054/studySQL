const connect = require("./.connectDB");

//получение статуса пользователя
exports.return_type_user = (login) => {
    return connect.query("select return_type_user('" + login + "')");
}

//результаты тестировани
  //преподаватель
exports.get_result_group = (login, idgroup, idtest) => {
    return connect.query("call get_result_group('" + login + "', " + idgroup + ", "+ idtest +")");
}
  //администратор
exports.get_results_group_admin = (idgroup, idtest) => {
    return connect.query("call get_results_group_admin(" + idgroup + ", "+ idtest +")");
}
  //студент
exports.get_result_student_test = (login, id) => {
    return connect.query("call get_result_student_test('" + login + "', "+ id +")");
}

//запросы для преподавателя
exports.get_lecturer_tests = (login) => {
    return connect.query("call get_lecturer_tests('" + login + "')");
}
exports.get_lecturers_groups = (login) => {
    return connect.query("call get_lecturers_groups('" + login + "')");
}
  //получение списка своих тестов определенной группы
exports.get_group_tests = (login, id) => {
    return connect.query("call get_group_tests('" + login + "', "+ id +")");
}

//запросы для администратора
  //получения списка всех тестов определенной группы
exports.get_groups_tests = (id) => {
    return connect.query("call get_groups_tests(" + id + ")");
}
  //получение списка всех студентов
exports.all_get_students = () => {
    return connect.query("call all_get_students()");
}
  //получение списка всех преподавателей
exports.all_get_lecturers = () => {
    return connect.query("call all_get_lecturers()");
}

//получение всех тестов и вопросов определенного теста
exports.get_tests = () => {
    return connect.query("call get_tests()");
}
exports.get_questions_test = (id) => {
    return connect.query("call get_questions_test("+ id +")");
}




