const connect = require("./.connectDB");

exports.allLecturers_groups = () => {
    return connect.query("SELECT * from lecturers_groups");
}

exports.lecturers_groups = (id) => {
    return connect.query("SELECT * from lecturers_groups where idlecturers_groups = " + id);
}

exports.addLecturers_groups = (login, shifr) => {
    return connect.query("call add_lecturers_groups('"+login+"', "+shifr+")");
}

exports.updateLecturers_groups = (id, login, shifr) => {
    return connect.query("call update_lecturers_groups("+ id +", '"+ login +"', "+ shifr +")");
}

exports.delLecturers_groups = (id) => {
    return connect.query("call del_lecturers_groups("+ id +")");
}