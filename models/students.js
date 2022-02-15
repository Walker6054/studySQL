const connect = require("./.connectDB");

exports.allStudents = () => {
    return connect.query("SELECT * from students");
}

exports.student = (login) => {
    return connect.query(`SELECT * from students 
        where login = "`+ login + `" OR
              email = "`+ login + `"
        `
    );
}

exports.addStudent = (login, password, email, group, f, i, o) => {
    let query = "INSERT INTO students ";

    // let temp = "";
    // if (o) {
    //     temp = 
    // }
    return connect.query();
}

exports.updateStudent = (id, x1, x2) => {
    return connect.query("SELECT * from admins");
}

exports.delStudent = (id) => {
    return connect.query("SELECT * from admins");
}