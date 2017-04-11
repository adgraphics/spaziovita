
/********
*********  TRELLO BOARD CONTENUTI 
*********  https://trello.com/b/iV7i6Ruc/sito
*********/
<<<<<<< HEAD


var express = require('express'); 
=======
var express = require('express');
>>>>>>> origin/master
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


<<<<<<< HEAD
=======
app.get('/update', function(req,res){
	loadModel().then(function(data) {
		res.send("BENE, HAI AGGIORNATO spaziovitaniguarda.it");
	});
});

>>>>>>> origin/master
var loadModel = function() {
	return new Promise(function(resolve, reject) {
		t.get("/1/lists/58eb869c344a7f4f5cbe61fd/cards", { attachments: true }, function(err, corsi) {
			if (err) {
				reject();
				return;
			}
			var model = {
				corsi : corsi
			};

			console.log("corsi" , JSON.stringify(corsi));
			console.log("------");
			resolve(model);
	  	});
	});
}
	
var model;
loadModel().then(function(data) {
	model = data;
});

app.get('/:page', function(req, res, next) {  
	console.log(model);
	if (req.params.page.endsWith(".html"))
		res.render(req.params.page, model);
	else
		next();
});

app.get('/corsi/:idcorso/:nomecorso', function(req, res, next) {

	model.corsi.forEach(function(c) {
		if (req.params.idcorso == c.id)
			res.render("corso.html", c);
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