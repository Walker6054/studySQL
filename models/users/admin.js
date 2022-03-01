const connect = require("../.connectDB");

//список всех админов
exports.allAdmins = async () => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("SELECT * from admins");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//информация о админе по логину
exports.admins = async (login) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call get_admins('"+ login + "')");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//возвращение id админа
exports.id_admins = async (login) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call get_id_admins('"+ login + "')");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//процедура добавления админа
exports.addAdmins = async (login, pass, email) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call add_admins('" + login + "', '" + pass + "', "+ email +" ')");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//процедура обновления админа
exports.updateAdmins = async (id, login, pass, email) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call update_admins("+id+", '" + login + "', '" + pass + "', '"+ email +"')");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//процедура обновления ЛК админа
exports.lk_updateAdmins = async (id, pass, email) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call lk_update_admins("+id + ", '" + pass + "', '"+ email +" ')");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//процедура удаления админа
exports.delAdmins = async (id) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call del_admins(" + id + ")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}