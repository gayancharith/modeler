import mysql from 'mysql';

export default class MySQL {

	constructor(configs) {

		this.connection = mysql.createConnection({
			connectionLimit: 10,
			host: configs.host,
			user: configs.user,
			password: configs.password,
			database: configs.db

		});

		this.connection.connect();

		// pool.query('SELECT alias FROM event', function(err, rows, fields) {
		// 	if (err) throw err;
		// 	console.log(rows);
		// });

		// pool.end();
	}

	/**
	 *	
	 */
	find(id, options) {
		let sql = "SELECT * FROM event WHERE `id`="+ id;

		return new Promise((resolve, reject) => {
			this.connection.query(sql, (error, results, fields) => {
				if (error) {
					reject(error);
				} else {
					console.log(results);
					resolve(results);
				}
			});
		});
	}

	end() {
		console.log('connection ends');
		this.connection.end();
	}

	create (obj){
		return obj;
	}
}