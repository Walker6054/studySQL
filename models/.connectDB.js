const mysql = require("mysql2");
const config = require("../config/config.json");

let connection;
try {
    connection = mysql.createConnection(config.mysql).promise();
} catch (err) {
    console.error("Ошибка: " + err);
}

module.exports = connection;





// connection.connect((err) => {
//     if (err) {
//         return console.error("Ошибка: " + err.message);
//     } else {
//         console.log("Подключение к серверу MySQL успешно установлено");
//     }
// });