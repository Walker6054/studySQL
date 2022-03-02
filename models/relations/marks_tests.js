const connect = require("../.connectDB");

exports.allMarks_tests = async () => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("SELECT * from marks_tests");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.marks_tests = async (id) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("SELECT * from marks_tests where idmarks_tests = " + id);
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.addMarks_tests = async (login, idtests, tryCount, percent) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call add_marks_tests('"+ login + "', "+ idtests + ", "+ tryCount + ", " + percent + ")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.updateMarks_tests = async (id, login, idtests, tryCount, percent) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call update_marks_tests("+ id + ", '"+ login + "', "+ idtests + ", "+ tryCount + ", " +percent + ")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.delMarks_tests = async (id) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call del_marks_tests("+ id +")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}