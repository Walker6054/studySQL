const connect = require("../.connectDB");

exports.allGroups = () => {
    return connect.query("SELECT * from `groups`");
}

exports.groups = (id) => {
    return connect.query("SELECT * from `groups` where idgroups = " + id);
}

exports.addGroups = (shifr) => {
    return connect.query("call add_groups('"+shifr+"')");
}

exports.updateGroups = (id, shifr) => {
    return connect.query("call update_groups("+ id +", '"+ shifr +"')");
}

exports.delGroups = (id) => {
    return connect.query("call del_groups("+ id +")");
}