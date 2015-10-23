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

	_queryBuilder(){

		let opts = {
			name : 'lahiru',
			age : '28',
			or : [{married : 'true', drivingLiscence : 'yes'}, {sex : 'male'}],
			city : 'kelaniya'
		}

		let query = "";

		Object.keys(opts).map((key) =>{

			if(key == 'or'){
				query += " AND " + this._orQuery(opts[key]);
			}else if (typeof opts[key] != 'object'){
				query += " AND " + key + "='" + opts[key] +"'";
			}
		});
		query = query.substr(4,query.length-1);
		console.log(query);
	}

	_orQuery (orArr){

		let orQ = "(";
		orArr.forEach((obj) =>{

			let keys = Object.keys(obj);

			if(keys.length > 1){
				orQ += this._andQuery(obj) + " OR ";
			}else if(keys.length == 1){
				orQ += keys[0] + "='" + obj[keys[0]] + "' OR ";
			}
		});

		orQ = orQ.substr(0, orQ.length-3);
		orQ +=")";
		return orQ;
	}

	_andQuery (obj){

		let andQuery = "(";
		Object.keys(obj).map((key) =>{

			if(key == 'or'){
				andQuery += this._orQuery(obj[key]) + " AND ";
			}else if(typeof obj[key] != 'object'){
				andQuery += key + "='" + obj[key] + "' AND ";
			}
		});
		andQuery = andQuery.substr(0,andQuery.length-4);
		andQuery += ")";
		return andQuery;
	}	
}