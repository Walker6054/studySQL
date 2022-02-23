const connect = require("../.connectDB");

exports.allQuestions = () => {
    return connect.query("SELECT * from questions");
}

exports.questions = (id) => {
    return connect.query("SELECT * from questions where idquestions = " + id);
}

exports.addQuestions = (idtests, formulation, answers, rightAnswer, comment, interactive) => {
    return connect.query("call add_questions("+ idtests + ", '"+ formulation + "', '"+ answers + "', '"+ rightAnswer + "', '"+ comment + "', "+ interactive +")");
}

exports.updateQuestions = (id, idtests, formulation, answers, rightAnswer, comment, interactive) => {
    return connect.query("call update_questions("+ id + ", " + idtests + ", '"+ formulation + "', '"+ answers + "', '"+ rightAnswer + "', '"+ comment + "', "+ interactive +")");
}

exports.delQuestions = (id) => {
    return connect.query("call del_questions("+ id +")");
}