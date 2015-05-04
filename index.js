var	express = require('express'),
	http = require('http'),
	app = express(),
	server = http.createServer(app),
	WebSocketServer = require('ws').Server,
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

var wss = new WebSocketServer({server: server});
console.log("websocket server created");

wss.on("connection", function(ws) {
	//send timestamp every second
	var id = setInterval(function() {
		ws.send(JSON.stringify(new Date()), function() { });
	}, 1000);

	console.log("websocket connection open");

	ws.on("close", function() {
		console.log("websocket connection close");
		clearInterval(id);
	});
});

// ----------- Database -----------

//gets the info from DB
pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  client.query('SELECT * FROM cards', function(err, result) {
    done();
    if(err) return console.error(err);
    console.log('DB:');
    console.log(result.rows);
  });
});

//TODO: update user info
//if user does not exist then add user to database



//TODO: get user info