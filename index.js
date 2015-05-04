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
			} if (message.substring(0,7) == 'getUser'){
				var myId = message.substring(8, 12);
				console.log(myId);
				client.query('SELECT person FROM cards', function(err, result) {
				    done();
				    if(err) return console.error(err);
				    var out = result.rows[0].person;
				    out = JSON.parse(out);
				    console.log(out.name);
/*
 [
 	{
 		person:
 			'{
 				"name":"Michael Guida",
 				"position":"Software Developer at CU Independent",
 				"skills":"iOS Development, Android Development, JavaScript",
 				"profile":"http://linkedin.com/in/mguida22",
 				"email":"michael.guida@colorado.edu",
 				"location":"Greater Denver Area",
 				"image":"https://media.licdn.com/mpr/mprx/0_eOkdZa9Hh5eH_JO36ZBsZu5XG8RH7sO3EsKnZSXJj5fJKOdTX4NL9DKc2aU92g0DWjQcBoVQbht5"
 			}'
 	}
 ]
*/
				    console.log('DB:');
				    //console.log(JSON.parse(out));
				    console.log(result.rows);
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

// ----------- Database -----------

//gets the info from DB
// pg.connect(process.env.DATABASE_URL, function(err, client, done) {
//   client.query('SELECT * FROM cards', function(err, result) {
//     done();
//     if(err) return console.error(err);
//     console.log('DB:');
//     console.log(result.rows);
//   });
// });