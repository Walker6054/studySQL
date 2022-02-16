const connect = require("./.connectDB");

exports.allTests = () => {
    return connect.query("SELECT * from tests");
}

exports.tests = (id) => {
    return connect.query("SELECT * from tests where idtests = " + id);
}

exports.addTests = (login, name, desc, maxTry) => {
    return connect.query("call add_tests('" + login + "', '" + name + "', '" + desc + "', " + maxTry + ")");
}

exports.updateTests = (id, login, name, desc, maxTry) => {
    return connect.query("call update_tests("+ id + ", '" + login + "', '" + name + "', '" + desc + "', " + maxTry + ")");
}

exports.delTests = (id) => {
    return connect.query("call del_tests("+ id +")");
}