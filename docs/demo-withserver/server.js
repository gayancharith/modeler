import express from 'express';
import bodyParser from 'body-parser';
import Orm from './src/Orm.js';
import path from 'path';

let app = express();
let appRoot = path.resolve(__dirname);
let schemaroot = appRoot +'/jsonmodels/';

console.log(schemaroot);

let configs = {
	adapter: 'mysql', //values possible => mysql, mongo
	host: 'localhost',
	port: '3306',
	user: 'root',
	password: 'pass',
	db: 'bloodDonatorDB',
	schemaDir : schemaroot
}
let orm = new Orm(configs);
// 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = process.env.PORT || 3002; 
let router = express.Router();

router.get('/', function(req, res) {

	let user = {
		firstName : 'lahiru',
		lastName : 'madhumal',
		email : 'email'
	};

	let request = {
		title : 'lahiru',
		request : 'request'
	};

	let event = {
		id: 4,
		alias: 'sample-event-5'
	};

	orm.user.create(user).then(result=>{
		console.log(result);
	}).catch(err=>{
		console.log(err);
	});

	// orm.request.create(request).then(result=>{
	// 	console.log(result);
	// }).catch(err=>{
	// 	console.log(err);
	// });

	orm.user.find(event).then(result=>{
		console.log('user >>>>');
		console.log(result);
	}).catch(err=>{
		console.log(err);
	});	

    res.json({ message: 'test server up' });   
});

app.use('/api', router);

app.listen(port);
console.log('server port: ' + port);