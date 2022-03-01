const connect = require("../.connectDB");

exports.allLecturers_groups = async () => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("SELECT * from lectures_groups");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.lecturers_groups = async (id) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("SELECT * from lectures_groups where idlectures_groups = " + id);
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.addLecturers_groups = async (login, idgroups) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call add_lectures_groups('"+login+"', "+idgroups+")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.updateLecturers_groups = async (id, login, idgroups) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call update_lectures_groups("+ id +", '"+ login +"', "+ idgroups +")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.delLecturers_groups = async (id) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call del_lectures_groups("+ id +")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}