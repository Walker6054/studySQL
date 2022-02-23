const connect = require("../.connectDB");

exports.allGroups_tests = () => {
    return connect.query("SELECT * from groups_tests");
}

exports.groups_tests = (id) => {
    return connect.query("SELECT * from groups_tests where idgroups_tests = " + id);
}

exports.addGroups_tests = (idgroups, idtest) => {
    return connect.query("call add_groups_tests("+idgroups+", "+idtest+")");
}

exports.updateGroups_tests = (id, idgroups, idtest) => {
    return connect.query("call update_groups_tests("+ id +", "+ idgroups +", "+ idtest +")");
}

exports.delGroups_tests = (id) => {
    return connect.query("call del_groups_tests("+ id +")");
}