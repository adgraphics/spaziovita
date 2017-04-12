
/********
*********  TRELLO BOARD CONTENUTI 
*********  https://trello.com/b/iV7i6Ruc/sito
*********/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var Trello = require("node-trello");
var ejs = require('ejs');

if(!process.env.NODE_ENV) // DEV
	process.env = require('./env.json')['development'];

var t = new Trello(process.env.TRELLO_API_KEY, process.env.TRELLO_API_TOKEN);

var app = express();

// set up ejs engine
app.set('views', path.join(__dirname, 'public'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');


app.get('/update', function(req,res){
	loadModel().then(function(data) {
		res.send("BENE, HAI AGGIORNATO spaziovitaniguarda.it");
	});
});

var model = {};
var loadModel = function() {
	var corsi = new Promise(function(resolve, reject) {
		t.get("/1/lists/58eb869c344a7f4f5cbe61fd/cards", { attachments: true }, function(err, corsi) {
			if (err) {
				reject();
				return;
			}
			
			resolve(corsi);
	  	});
	});


	var people = new Promise(function(resolve, reject) {
		t.get("/1/lists/58ecc93e3c1d4af7ea4e94dc/cards", { attachments: true }, function(err, people) {
			if (err) {
				reject();
				return;
			}
			resolve(people);
	  	});
	});

	var eventi = new Promise(function(resolve, reject) {
		t.get("/1/lists/58ecdc431b13b17a879f4e69/cards", { attachments: true }, function(err, eventi) {
			if (err) {
				reject();
				return;
			}
			resolve(eventi);
	  	});
	});


	var progetti = new Promise(function(resolve, reject) {
		t.get("/1/lists/58ed0b93e601e0f759933d33/cards", { attachments: true }, function(err, progetti) {
			if (err) {
				reject();
				return;
			}
			resolve(progetti);
	  	});
	});

	// var cinema = new Promise(function(resolve, reject) {
	// 	t.get("/1/lists/58ed0b93e601e0f759933d33/cards", { attachments: true }, function(err, cinema) {
	// 		if (err) {
	// 			reject();
	// 			return;
	// 		}
	// 		resolve(cinema);
	//   	});
	// });

	return Promise.all([corsi, people, eventi, progetti]).then(function(values) {
		model = {
			corsi : values[0],
			people : values[1],
			eventi : values[2],
			progetti : values[3]
		}
	});
}


	
loadModel();

app.get(['/', '/:page'], function(req, res, next) {  
	if (!req.params.page)
		req.params.page = "index.html";
	if (req.params.page.endsWith(".html"))
		res.render(req.params.page, model);
	else
		next();
});

app.get('/corso/:idcorso/:nomecorso', function(req, res, next) {

	model.corsi.forEach(function(c) {
		if (req.params.idcorso == c.id)
			res.render("corso.html", c);
	});
	
});

app.get('/evento/:idevento/:nomeevento', function(req, res, next) {

	model.eventi.forEach(function(c) {
		if (req.params.idevento == c.id)
			res.render("evento.html", c);
	});
	
});


app.get('/progetto/:id/:nome', function(req, res, next) {

	model.progetti.forEach(function(c) {
		if (req.params.id == c.id)
			res.render("progetto.html", c);
	});
	
});


app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error', err.message);
});

module.exports = app;

var port = process.env.PORT || 8888;
app.listen(port, null, function (err) {
  console.log('Gatekeeper, at your service: http://localhost:' + port);
});