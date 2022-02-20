const connect = require("./.connectDB");

exports.get_result_group = (login, shifr, id) => {
    return connect.query("call get_result_group('" + login + "', '" + shifr + "', "+ id +")");
}

exports.get_questions_test = (id) => {
    return connect.query("call get_questions_test("+ id +")");
}

exports.get_result_student_test = (login, id) => {
    return connect.query("call get_result_student_test('" + login + "', "+ id +")");
}

exports.get_lecturer_tests = (login) => {
    return connect.query("call get_lecturer_tests('" + login + "')");
}

exports.get_lecturers_groups = (login) => {
    return connect.query("call get_lecturers_groups('" + login + "')");
}

exports.return_type_user = (login) => {
    return connect.query("select return_type_user('" + login + "')");
}

exports.get_tests = () => {
    return connect.query("call get_tests()");
}