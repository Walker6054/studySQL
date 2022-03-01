const mysql = require("mysql2");
const config = require("../config");

let connection = mysql.createPool(config[0]).promise();

connection.getConnection()
    .then((connection) => {
        connection.release();
    })
    .catch((err) => {
        console.error("Ошибка: " + err.message);
    });

module.exports = connection;