import mysql from 'mysql';

export default class MySQL {
	constructor(configs) {
		let pool = mysql.createPool({
			connectionLimit: 10,
			host: configs.host,
			user: configs.user,
			password: configs.password,
			database: configs.db
		});

		connection.connect();

		connection.query('SELECT alias FROM event', function(err, rows, fields) {
			if (err) throw err;

			console.log(rows);
		});

		connection.end();
	}

	find(id, options) {

	}
}