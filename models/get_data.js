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