import mysql from 'mysql';

export default class MySQL {

	constructor(configs) {
		let limit = 10;
		if(configs.connectionLimit){
			limit = configs.connectionLimit;
		}

		this.pool = mysql.createPool({
			connectionLimit: limit,
			host: configs.host,
			user: configs.user,
			password: configs.password,
			database: configs.db

		});
	}

	/**
	 * find a record from the database.
	 * @param  {Object} options filter object
	 * @return {[type]}       [description]
	 */
	find(table, options) {
		
		let sql = this._findQuery(table, options);

		return new Promise((resolve, reject) => {
			this.pool.query(sql, (error, results, fields) => {
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
		this.pool.end();
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
			this.pool.query(query, (error, results, fields) =>{
				if(error){
					reject(error);
				}else{
					resolve(results);
				}
			});
		});
	}

	/**
	 * delete records from a table with given constraints.
	 * @param  {string} table
	 * @param  {Object} opts  constraints to be set
	 * @return {Promise}       
	 */
	delete(table, opts){

		let query = this._deleteQuery(table, opts);
		return new Promise((resolve, reject) =>{
			this.pool.query(query, (error, results, fields) => {
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

	/**
	 * generates the query string for a delete operation
	 * @param  {string} table table name of the record to be deleted.
	 * @param  {Object} opts  restrictions as a json object.
	 * @return {String}       delete query string.
	 */
	_deleteQuery(table, opts) {
		let query = "DELETE FROM " + table + " WHERE " +this._queryBuilder(opts);
		return query;
	}

	_queryBuilder(opts = {}){

		let query = "";

		Object.keys(opts).map((key) =>{

			if(key == 'or'){
				query += " AND " + this._orQuery(opts[key]);
			}else if (typeof opts[key] != 'object'){
				query += " AND " + key + "='" + opts[key] +"'";
			}else if (typeof opts[key] == 'object' && Object.keys(opts[key]).length == 1) {
				Object.keys(opts[key]).map((idx) =>{
					if(idx == '<' || idx == '>')
						query += " AND " + this._compareQuery(key, opts[key]) + " ";
				});
			}
		});

		query = query.substr(4,query.length-1);
		return query;
	}

	_orQuery (orArr){

		let orQ = "(";
		orArr.forEach((obj) =>{

			let keys = Object.keys(obj);

			if(keys.length > 1){
				orQ += this._andQuery(obj) + " OR ";
			}else if(keys.length == 1 && typeof obj[keys[0]] != 'object'){
				orQ += keys[0] + "='" + obj[keys[0]] + "' OR ";
			}else if(keys.length == 1 && typeof obj[keys[0]] == 'object'){
				let orObj = obj[keys[0]];
				let orObjKeys = Object.keys(orObj);
				if(orObjKeys.length == 1 && (orObjKeys[0] == '<' || orObjKeys[0] == '>'))
					orQ += this._compareQuery(keys[0], orObj) + " OR ";
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
			}else if(typeof obj[key] == 'object' && Object.keys(obj[key]).length == 1){
				Object.keys(obj[key]).map((idx) =>{
					if(idx == '<' || idx == '>')
						andQuery += this._compareQuery(key, obj[key]) + " AND ";
				});
			}
		});
		andQuery = andQuery.substr(0,andQuery.length-4);
		andQuery += ")";
		return andQuery;
	}

	_compareQuery(objKey, obj){

		let compQuery = "";
		let keys = Object.keys(obj);

		if(keys.length != 1){
			throw Error('Format error : compare object cannot have multiple keys');
		} else{
			keys.map((key) =>{

				if(typeof obj[key] == 'object'){
					throw Error ('Format error : compare value cannot be an object');
				}else{
					compQuery = objKey + " " + key + "'" + obj[key] + "'";
				}
			});
		}

		return compQuery;
	}	
}