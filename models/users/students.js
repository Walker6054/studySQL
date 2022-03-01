const connect = require("../.connectDB");

//список всех студентов
exports.allStudents = async () => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("SELECT * from students");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//информация о студенте по логину
exports.students = async (login) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call get_students('"+ login + "')");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//информация о студенте по id
exports.get_info_student = async (id) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call get_info_student("+ id + ")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//возвращение id студента
exports.id_students = async (login) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call get_id_students('"+ login + "')");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//процедура добавления студента
exports.addStudents = async (login, email, password, idgroups, f, i, o) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call add_students('"+ login + "', '"+ password + "', '"+ email + "', "+ idgroups + ", '"+ f + "', '"+ i +"', '"+ o +"')");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//процедура обновления студента
exports.updateStudents = async (id, login, email, idgroups, f, i, o) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call update_students("+ id + ", '"+ login + "', '"+ email + "', "+ idgroups + ", '"+ f + "', '"+ i +"', '"+ o +"')");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//процедура обновления ЛК студента
exports.lk_updateStudents = async (id, password, email, f, i, o) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call lk_update_students("+ id + ", '"+ password + "', '"+ email + "', '"+ f + "', '"+ i +"', '"+ o +"')");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//процедура удаления студента
exports.delStudents = async (id) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call del_students("+ id +")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//получение всех тестов студента (не)пройденных
exports.get_student_tests = async (login) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call get_student_tests('"+ login +"')");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//получение определенного теста студента (необходимо для проверки на существование/прикрепленность)
exports.get_student_test = async (login, idtest) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call get_student_test('"+ login +"', " + idtest + ")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//получение всех результатов тестов студента (не)пройденных до конца
exports.get_result_student_test_with_answers = async (login, idtest) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call get_result_student_test_with_answers('"+ login +"', " + idtest + ")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//получение номера последней попытки студента определенного теста
exports.return_try_count_test = async (login, idtest) => {
    let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call return_try_count_test('"+ login +"', " + idtest + ")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}