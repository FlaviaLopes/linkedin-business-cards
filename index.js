var	express = require('express'),
	http = require('http'),
	app = express(),
	server = http.createServer(app),
	WebSocketServer = require('ws').Server,
	pg = require('pg');

var connected = false,
	userId = 1;

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

server.listen(app.get('port'), function(){
	console.log("Express server listening on port " + server.address().port);
});

app.get('/user', function(request, response) {
	userId = request.query.id;
	console.log('id: ' + userId);
	response.redirect('/');
});

var wss = new WebSocketServer({server: server});
console.log("websocket server created");

wss.on("connection", function(ws) {
	//send timestamp every second
	// var id = setInterval(function() {
	// 	ws.send(JSON.stringify(new Date()), function() { });
	// }, 1000);

	ws.on('message', function(message) {
		console.log('client requested: ' + message);

		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			if (message == 'getAll'){
				client.query('SELECT * FROM cards', function(err, result) {
				    done();
				    if(err) return console.error(err);
				    console.log('DB:');
				    console.log(result.rows);
				});
			} if (message == 'getUser'){

				client.query('SELECT person FROM cards ORDER BY id', function(err, result) {
				    done();

				    if(err) return console.error(err);

				    var data = result.rows[userId-1].person;
				    ws.send(data);
				});
			} else {
				console.log('invalid request');
			}
		});

    });

	console.log("websocket connection open");

	ws.on("close", function() {
		console.log("websocket connection close");
		//clearInterval(id);
	});
});