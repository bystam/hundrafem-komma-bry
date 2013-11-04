var express = require('express')
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	stylus = require('stylus'),
	nib = require('nib');

/*
// setup .styl to .css compilation
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}
*/

// express app configuring
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
/*
app.use(stylus.middleware(
	{ src: __dirname + '/public'
	, compile: compile
	}
));
*/
app.use(express.static(__dirname + '/public'))

// setup root route
app.get('/', function(req, res) {
	res.render('stylish-portfolio',
		{ title : 'Radio' }
	);
});

// Heroku specific configuration
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

// setup socket.io echoing
io.sockets.on('connection', function (socket) {
	socket.on('to-server', function(data) {
		io.sockets.emit('to-client', data );
	});
});

// start server listening
var port = process.env.PORT || 5000;
server.listen(port, function() {
	console.log("Listening on port: " + port);
});