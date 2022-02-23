const connect = require("../.connectDB");

exports.allMarks_questions = () => {
    return connect.query("SELECT * from marks_questions");
}

exports.marks_questions = (id) => {
    return connect.query("SELECT * from marks_questions where idmarks_questions = " + id);
}

exports.addMarks_questions = (login, idquestion, tryCount, answer, right) => {
    return connect.query("call add_marks_questions('"+ login + "', "+ idquestion + ", "+ tryCount + ", '"+ answer + "', "+ right + ")");
}

exports.updateMarks_questions = (id, login, idquestion, tryCount, answer, right) => {
    return connect.query("call update_marks_questions("+ id + ", '"+ login + "', "+ idquestion + ", "+ tryCount + ", '"+ answer + "', "+ right + ")");
}

exports.delMarks_questions = (id) => {
    return connect.query("SELECT * from marks_questions");
}