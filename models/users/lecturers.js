const connect = require("../.connectDB");

//список всех преподавателей
exports.allLecturers = async () => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("SELECT * from lecturers");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//информация о преподавателе по логину
exports.lecturers = async (login) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call get_lecturers('"+ login + "')");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//информация о преподавателе по id
exports.get_info_lecturer = async (id) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call get_info_lecturer("+ id + ")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//возвращение id преподавателя
exports.id_lecturers = async (login) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call get_id_lecturers('"+ login + "')");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//процедура добавления преподавателя
exports.addLecturers = async (login, password, email, f, i, o, institute) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call add_lecturers('"+ login + "', '"+ password + "', '"+ email + "', '"+ f + "', '"+ i + "', '"+ o + "', '"+ institute +"')");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//процедура обновления преподавателя
exports.updateLecturers = async (id, login, email, f, i, o, institute) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call update_lecturers("+ id +", '" + login + "', '"+ email + "', '"+ f + "', '"+ i + "', '"+ o + "', '"+ institute +"')");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//процедура обновления ЛК преподавателя
exports.lk_updateLecturers = async (id, password, email, f, i, o, institute) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call lk_update_lecturers("+ id +", '" + password + "', '"+ email + "', '"+ f + "', '"+ i + "', '"+ o + "', '"+ institute +"')");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//процедура удаления преподавателя
exports.delLecturers = async (id) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call del_lecturers("+ id +")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//функция проверки теста на принадлежность преподавателю
exports.check_lecturer_test = async (login, idtest) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call check_lecturer_test('" + login + "', " + idtest + ")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

