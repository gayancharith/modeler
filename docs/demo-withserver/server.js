import express from 'express';
import bodyParser from 'body-parser';
let app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3002; 
var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'test server up' });   
});

app.use('/api', router);

app.listen(port);
console.log('server port: ' + port);