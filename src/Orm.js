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
 * 	password 'pass' 	
 * }
 *
 *
 * import Orm from 'Orm';
 * let orm = new Orm(configs, meta);;
 * let user = {firstName : 'gayan', lastName : 'Madhumal'};
 * orm.user.create(user);
 */
export default class Orm {

	constructor(configs, meta){
		_setAdapter(configs.adapter);
	}

	find() {

	}

	/**
	 * insert an object to the database
	 * @param  {Object} obj object to be inserted.
	 * @return {[type]}     [description]
	 */
	create(obj) {
		this.adapter.create(obj);
	}

	delete() {

	}

	update() {

	}

	/**
	 * Set the adapter type acording to the database to be used.
	 * @param {string} adapter currently only 'mysql' and 'mongo' values are supported
	 */
	_setAdapter(adapter){

		if(!adapter)
			throw Error('adapter not set.');

		switch(adapterType) {
			case : 'mysql'
				this.adapter = new MySQL();
				break;
			case : 'mongo'
				this.adapter = new Mongo();
				break;
			default : 
				throw Error('specified adapter not supported.');
				break; 
		}
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

		return new Promise((resolve, reject) = > {
			tv4.validate(data, schema, function(isValid, validationError){
				if(isValid){
					resolve({valid : true});
				}else{
					reject({valid : false, error : validationError});
				}
			});
		}); 
	}

}
