var	express = require('express'),
	http = require('http'),
	app = express(),
	server = http.createServer(app),
	WebSocketServer = require('ws').Server,
	pg = require('pg');

var connected = false,
	userId = undefined;

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

server.listen(app.get('port'), function(){
	console.log("Express server listening on port " + server.address().port);
});

//get user id and redirect to root
app.get('/user', function(request, response) {
	userId = request.query.id;
	console.log('id: ' + userId);
	response.redirect('/');
});

var wss = new WebSocketServer({server: server});
console.log("websocket server created");

wss.on("connection", function(ws) {

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		if(err) return console.error(err);

		if (userId == undefined){
			console.log('no userId');
		} else {
			client.query('SELECT person FROM cards ORDER BY id', function(err, result) {
			    done();

			    if(err) return console.error(err);

			    if (userId-1 > result.rowCount) {
			    	console.log('invalid user id');
			    } else {
				    var data = result.rows[userId-1].person;
				    ws.send(data);
			    }
			});
		}
	});

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
			} else if (message == 'getUser'){

				if (userId == undefined){
					console.log('no userId');
				} else {
					client.query('SELECT person FROM cards ORDER BY id', function(err, result) {
					    done();

					    if(err) return console.error(err);

					    if (userId-1 > result.rowCount) {
					    	console.log('invalid user id');
					    } else {
						    var data = result.rows[userId-1].person;
						    ws.send(data);
					    }
					});
				}
			} else if (message.substring(0,8) == 'saveUser') {

				var data = message.substring(9);
				data = JSON.parse(data);

				client.query('SELECT count(*) AS exact_count FROM cards', function(err, result) {

					if(err) return console.error(err);

					data.id = parseInt(result.rows[0].exact_count, 10) + 1;

					data = JSON.stringify(data);

					console.log('About to insert this...');
					console.log(data);

					client.query('INSERT INTO cards (person) VALUES (\'' + data + '\')', function(err, result) {
						done();

						if(err) return console.error(err);
						console.log('successfuly added!');
					});
				});
			} else if (message = 'getLink') {
				client.query('SELECT count(*) AS exact_count FROM cards', function(err, result) {
					done();

					if(err) return console.error(err);

					var link = 'user?id=';
					link += parseInt(result.rows[0].exact_count, 10);

					ws.send('link: ' + link);
				});
			} else {
				console.log('invalid request');
			}
		});

    });

	console.log("websocket connection open");

	ws.on("close", function() {
		console.log("websocket connection close");
	});
});