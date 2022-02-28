const connect = require("../.connectDB");

exports.allLecturers_groups = () => {
    return connect.query("SELECT * from lectures_groups");
}

exports.lecturers_groups = (id) => {
    return connect.query("SELECT * from lectures_groups where idlectures_groups = " + id);
}

exports.addLecturers_groups = (login, idgroups) => {
    return connect.query("call add_lectures_groups('"+login+"', "+idgroups+")");
}

exports.updateLecturers_groups = (id, login, idgroups) => {
    return connect.query("call update_lectures_groups("+ id +", '"+ login +"', "+ idgroups +")");
}

exports.delLecturers_groups = (id) => {
    return connect.query("call del_lectures_groups("+ id +")");
}