import MySQL from './MySQL';
import Mongo from './Mongo';

/**
 * USAGE : 
 * 
 * let configs = {
 * 
 * 	adapter : 'mysql',//values possible => mysql, mongo
 * 	host : 'localhost',
 * 	port : '3306',
 * 	password 'pass'
 * 	
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

	create() {

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

}