
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

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/corsi/:name/', function(req, res, next) {  
	// cicla sulla lista dei corsi 
	t.get("/1/lists/58eb869c344a7f4f5cbe61fd/cards", function(err, corsi) {
	  if (err) throw err;

	  for (var i = 0; i < corsi.length; i++) {
	  	if(corsi[i].name == req.params.name)
			res.render('corso', {corso : corsi[i]});
		else{
			var err = new Error('Not Found');
			err.status = 404;
			next(err);
		}
	  };
	});
});

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
  res.render('error');
});

module.exports = app;


var port = process.env.PORT || 8888;
app.listen(port, null, function (err) {
  console.log('Gatekeeper, at your service: http://localhost:' + port);
});


