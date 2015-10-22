import express from 'express';
import bodyParser from 'body-parser';
import Orm from './src/Orm.js';
let app = express();
let configs = {
			adapter: 'mysql', //values possible => mysql, mongo
			host: 'localhost',
			port: '33060',
			user: 'root',
			password: 'pass',
			db: 'bloodDonatorDB'
		}
let orm = new Orm(configs);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = process.env.PORT || 3002; 
let router = express.Router();

router.get('/', function(req, res) {

	let user = {
		firstName : 'lahiru',
		email : 'email'
	};
	console.log('creating user');

	orm.create(user).then(result=>{
		console.log(result);
	}).catch(err=>{
		console.log(err);
	});
    res.json({ message: 'test server up' });   
});

app.use('/api', router);

app.listen(port);
console.log('server port: ' + port);