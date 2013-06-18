var express = require('express');

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));

app.get('/', function(req, res) {
	res.render('index');
});

app.listen(8080);