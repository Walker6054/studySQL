const connect = require("../.connectDB");

exports.allMarks_questions = async () => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("SELECT * from marks_questions");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.marks_questions = async (id) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("SELECT * from marks_questions where idmarks_questions = " + id);
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.addMarks_questions = async (login, idquestion, tryCount, answer, right) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call add_marks_questions('"+ login + "', "+ idquestion + ", "+ tryCount + ", '"+ answer + "', "+ right + ")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.updateMarks_questions = async (id, login, idquestion, tryCount, answer, right) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call update_marks_questions("+ id + ", '"+ login + "', "+ idquestion + ", "+ tryCount + ", '"+ answer + "', "+ right + ")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.delMarks_questions = async (id) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call del_marks_questions("+ id + ")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}