import mysql from 'mysql';

export default class MySQL {
	constructor(configs) {
		let pool = mysql.createConnection({
			connectionLimit: 10,
			host: configs.host,
			user: configs.user,
			password: configs.password,
			database: configs.db
		});

		pool.connect();

		pool.query('SELECT alias FROM event', function(err, rows, fields) {
			if (err) throw err;

			console.log(rows);
		});

		pool.end();
	}

	find(id, options) {

	}
}