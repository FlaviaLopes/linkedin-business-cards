var	express = require('express'),
	http = require('http'),
	app = express(),
	server = http.createServer(app),
	io = require('socket.io').listen(server),
	pg = require('pg'),
	connected = false;

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send(__dirname + '/public/index.html');
});

server.listen(app.get('port'), function(){
	console.log("Express server listening on port " + server.address().port);
});

io.sockets.on('connection', function (socket) {
	// notify when connected
	console.log('socket.io connected');
	connected = true;

	// notify when disconnected
	socket.on('disconnect', function() {
		console.log('socket.io disconnected');
		connected = false;
	});

	//send data to client
	//socket.emit('event', data);

	//recieving data from client
	socket.on('data', function(data) {
		//do something with data recieved
	});
});