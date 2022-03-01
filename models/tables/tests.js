const connect = require("../.connectDB");

exports.allTests = async () => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("SELECT * from tests");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.tests = async (id) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("SELECT * from tests where idtests = " + id);
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.addTests = async (login, name, desc, maxTry) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call add_tests('" + login + "', '" + name + "', '" + desc + "', " + maxTry + ")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.updateTests = async (id, name, desc, maxTry) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call update_tests("+ id + ", '" + name + "', '" + desc + "', " + maxTry + ")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.delTests = async (id) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call del_tests("+ id +")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}