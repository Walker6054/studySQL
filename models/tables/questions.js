const connect = require("../.connectDB");

exports.allQuestions = async () => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("SELECT * from questions");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.questions = async (id) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("SELECT * from questions where idquestions = " + id);
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.addQuestions = async (idtests, formulation, answers, rightAnswer, comment, interactive) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call add_questions("+ idtests + ", '"+ formulation + "', '"+ answers + "', '"+ rightAnswer + "', '"+ comment + "', "+ interactive +")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.updateQuestions = async (id, idtests, formulation, answers, rightAnswer, comment, interactive) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call update_questions("+ id + ", " + idtests + ", '"+ formulation + "', '"+ answers + "', '"+ rightAnswer + "', '"+ comment + "', "+ interactive +")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.delQuestions = async (id) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call del_questions("+ id +")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}