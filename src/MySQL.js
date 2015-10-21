import mysql from 'mysql';

export default class MySQL {
	constructor(configs)	 {
		var pool = mysql.createPool({
			connectionLimit: 10,
			host: configs.host,
			user: configs.user,
			password: configs.password
		});
	}

	find(id, options) {

	}
}