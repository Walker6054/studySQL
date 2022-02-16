const connect = require("./.connectDB");

exports.allMarks_tests = () => {
    return connect.query("SELECT * from marks_tests");
}

exports.marks_tests = (id) => {
    return connect.query("SELECT * from marks_tests where idmarks_tests = " + id);
}

exports.addMarks_tests = (login, idtests, tryCount, percent) => {
    return connect.query("call add_marks_tests('"+ login + "', "+ idtests + ", "+ tryCount + ", " + percent + ")");
}

exports.updateMarks_tests = (id, login, idtests, tryCount, percent) => {
    return connect.query("call update_marks_tests("+ id + ", '"+ login + "', "+ idtests + ", "+ tryCount + ", " +percent + ")");
}

exports.delMarks_tests = (id) => {
    return connect.query("call del_marks_tests("+ id +")");
}