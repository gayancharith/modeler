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
	 * find a record from the database.
	 * @param  {Object} options filter object
	 * @return {[type]}       [description]
	 */
	find(table, options) {
		
		let sql = this._findQuery(table, options);

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

	/**
	 * insert a record to the database.
	 * @param  {String} name of the to be inserted
	 * @param  {Object} model object to be inserted.
	 * @return {[type]}       [description]
	 */
	create (table, obj){

		let query = this._insertQuery(table, obj);

		return new Promise((resolve, reject) =>{
			this.connection.query(query, (error, results, fields) =>{
				if(error){
					reject(error);
				}else{
					resolve(results);
				}
			});
		});
	}

	/**
	 * generate the query string for insert.
	 * 
	 * insert a record to the database.
	 * @param  {String} name of the to be inserted
	 * @param  {Object} model object to be inserted.
	 * @return {String} returns the query string.
	 */
	_insertQuery (table, data){

		let fields = Object.keys(data).join();
		let valuesArr = Object.values(data);
		let values = "";
		valuesArr.forEach((value) => {
			values += "'" + value +"',";
		});

		values = values.substr(0, values.length-1);

		let query = "INSERT INTO " + table + " ("+ fields + ") VALUES (" + values +");";

		return query;
	}

	/**
	 * create a sql search query string
	 * @param  {[type]} json [description]
	 * @return {[type]}      [description]
	 */
	_findQuery(table, json) {
		let queryString = Object.keys(json).map(function(key) {
			return ("`" + key + "`='" + json[key] + "'");
		}).join('&&');

		let query = "SELECT * FROM "+ table +" WHERE "+ queryString;
		return query;
	}	
}