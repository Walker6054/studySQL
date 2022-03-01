const connect = require("../.connectDB");

exports.allUsers = async () => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("SELECT * from users");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.users = async (login) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call get_users('"+ login + "')");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.addUsers = async (login, pass, email) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call add_users('" + login + "', '" + pass + "', '"+ email +"')");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.updateUsers = async (id, login, pass, email) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call update_users("+id+", '" + login + "', '" + pass + "', '"+ email +"')");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.delUsers = async (id) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call del_users(" + id + ")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}