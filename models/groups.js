const connect = require("./.connectDB");

exports.allAdmins = () => {
    return connect.query("SELECT * from admins");
}

exports.admin = (id) => {
    return connect.query("SELECT * from admins");
}

exports.addAdmin = (x1, x2) => {
    return connect.query("SELECT * from admins");
}

exports.updateAdmin = (id, x1, x2) => {
    return connect.query("SELECT * from admins");
}

exports.delAdmin = (id) => {
    return connect.query("SELECT * from admins");
}