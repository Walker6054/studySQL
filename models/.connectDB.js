const mysql = require("mysql2");
const config = require("../config/config.json");

let connection;
try {
    connection = mysql.createConnection(config.mysql).promise();
} catch (err) {
    console.error("Ошибка: " + err);
}

module.exports = connection;