const mysql = require("mysql2");
const config = require("../config/config.json");

let connection = mysql.createPool(config.mysql).promise();

connection.getConnection()
    .catch((err) => {
        console.error("Ошибка: " + err.message);
    });

module.exports = connection;