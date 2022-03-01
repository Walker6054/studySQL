const connect = require("../.connectDB");

exports.allGroups_tests = async () => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("SELECT * from groups_tests");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.groups_tests = async (id) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("SELECT * from groups_tests where idgroups_tests = " + id);
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.addGroups_tests = async (idgroups, idtest) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call add_groups_tests("+idgroups+", "+idtest+")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.updateGroups_tests = async (id, idgroups, idtest) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call update_groups_tests("+ id +", "+ idgroups +", "+ idtest +")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

exports.delGroups_tests = async (id) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call del_groups_tests("+ id +")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}