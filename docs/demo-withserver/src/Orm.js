import path from 'path';
import fs from 'fs';
import MySQL from './MySQL';
import Mongo from './Mongo';
import tv4 from 'tv4';

/**
 * USAGE : 
 * 
 * let configs = {
 * 
 * 	adapter : 'mysql',//values possible => mysql, mongo
 * 	host : 'localhost',
 * 	port : '3306',
 * 	user : 'username',
 * 	password: 'pass', 	
 * 	db: 'databaseName' 	
 * }
 *
 *
 * import Orm from 'Orm';
 * let orm = new Orm(configs, meta);;
 * let user = {firstName : 'gayan', lastName : 'Madhumal'};
 * orm.user.create(user);
 */
export default class Orm {

	constructor(configs, meta) {
		this.schema = [];
		this._loadSchema(configs.schemaDir);
		this._setAdapter(configs);
	}

	/**
	 * @param  {String} id - id of the row
	 * @param  {Object} options - filter data from the table
	 * @return {Promise}
	 */
	find(id, options) {
		return new Promise((resolve, reject) => {
			this.adapter.find(id, options)
			.then(foundData => {
				console.log(foundData);
				resolve(foundData);
			})
			.catch((error) => {
				reject(error);
			});
		});
	}

	/**
	 * insert an object to the database
	 * @param  {Object} obj object to be inserted.
	 * @return {[type]}     [description]
	 */
	create(obj, model) {

		let modelSchema = this.schema[model];
		
		return new Promise((resolve, reject) => {

			this._validate(obj, modelSchema).then(result=>{
				return (result);
			})
			.then(data=>{
				return this.adapter.create(obj);
			})
			.then(result => {
				resolve(result);
			})
			.catch(error => {
				reject(error);
			});
		});
	}

	delete() {

	}

	update() {

	}

	/**
	 * destroy the connection
	 */
	end() {
		this.adapter.end();
	}

	/**
	 * Set the adapter type acording to the database to be used.
	 * @param {string} adapter currently only 'mysql' and 'mongo' values are supported
	 */
	_setAdapter (configs){

		if(!configs.adapter)
			throw Error('adapter not set.');

		switch(configs.adapter) {
			case 'mysql':
				this.adapter = new MySQL(configs);
				break;
			case 'mongo':
				this.adapter = new Mongo();
				break;
			default : 
				throw Error('specified adapter not supported.');
				break; 
		}
	}

	/**
	 * [_loadSchema description]
	 * @param  {[type]} schemaDir [description]
	 * @return {[type]}           [description]
	 */
	_loadSchema (schemaDir){

		let files = fs.readdirSync(schemaDir);
		files.forEach((file)=>{
			let schemaContent = require(path.join(schemaDir + '/', file));
			let model = schemaContent.title;
			this.schema[model] = schemaContent;
		});
	}

	/**
	 *
	 * eg : 
	 *
	 * schema = {
	 *
	 * 	title : 'user model',
	 * 	type : 'object',
	 * 	properties : {
	 * 		firstName : {
	 * 			type : 'string'
	 * 		},
	 * 		lastName : {
	 * 			type : 'string'
	 * 		},
	 * 		email : {
	 * 			type : 'string',
	 * 			format : 'email'
	 * 		}
	 * 	},
	 * 	required : ['firstName', 'email']
	 * }
	 *
	 * data = {
	 *
	 * 	firstName : 'lahiru',
	 * 	lastName : 'madhumal',
	 * 	email : 'madhumal.lahiru.hd@gmail.com'
	 * 
	 * }
	 * 
	 * _validate(data, schema);
	 * 
	 * validates the data using the json schema given
	 * @param  {Object} data   json object to be validated.
	 * @param  {object} schema json schema object to be validated against.
	 * @return {boolean}        valid or not
	 */
	_validate(data, schema){

		return new Promise((resolve, reject) => {

			let result = tv4.validate(data, schema);

			if(result){
				resolve(result);
			}else{
				reject(tv4.error);
			}			
		}); 
	}

}
