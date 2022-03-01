const connect = require("./.connectDB");

//получение статуса пользователя
exports.return_type_user = async (login) => {
	let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call return_type_user('" + login + "')");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//результаты тестировани
  //преподаватель
exports.get_result_group = async (login, idgroup, idtest) => {
	let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call get_result_group('" + login + "', " + idgroup + ", "+ idtest +")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}
  //администратор
exports.get_results_group_admin = async (idgroup, idtest) => {
	let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call get_results_group_admin(" + idgroup + ", "+ idtest +")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}
  //студент
exports.get_result_student_test = async (login, id) => {
	let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call get_result_student_test('" + login + "', "+ id +")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//запросы для преподавателя
exports.get_lecturer_tests = async (login) => {
	let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call get_lecturer_tests('" + login + "')");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}
exports.get_lecturers_groups = async (login) => {
	let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call get_lecturers_groups('" + login + "')");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}
  //получение списка своих тестов определенной группы
exports.get_group_tests = async (login, id) => {
	let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call get_group_tests('" + login + "', "+ id +")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//запросы для администратора
  //получения списка всех тестов определенной группы
exports.get_groups_tests = async (id) => {
	let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call get_groups_tests(" + id + ")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}
  //получение списка всех студентов
exports.all_get_students = async () => {
	let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call all_get_students()");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}
  //получение списка всех преподавателей
exports.all_get_lecturers = async () => {
	let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call all_get_lecturers()");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}

//получение всех тестов и вопросов определенного теста
exports.get_tests = async () => {
	let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call get_tests()");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}
exports.get_questions_test = async (id) => {
	let connection;
	let query;
	await connect.getConnection()
		.then((that_connection) => {
			connection = that_connection;
			return that_connection.query("call get_questions_test("+ id +")");
		})
		.then((res) => {
			query = res;
			connection.release();
		});
    return query;
}




