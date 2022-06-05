const connect = require("../.connectDB");

exports.allGroups = async () => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("SELECT * from `groups`");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.groups = async (id) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("SELECT * from `groups` where idgroups = " + id);
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.addGroups = async (shifr) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call add_groups('"+shifr+"')");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.updateGroups = async (id, shifr) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call update_groups("+ id +", '"+ shifr +"')");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.delGroups = async (id) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call del_groups("+ id +")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//список всех студентов из конкретной группы
exports.get_students_group = async (id) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call get_students_group("+ id + ")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}