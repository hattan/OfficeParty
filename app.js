var express = require('express'),
		bodyParser = require('body-parser'),
		mongoose = require('mongoose'),
		youtube = require('./youtube'),
		path = require('path'),
		routes = require('./routes/index'),
		videoRoutes = require('./routes/videos'),
		config=require('./config.js'),
		passport = require('passport'),
		initPassport = require('./passport/init'),
		expressSession = require('express-session');
		

var app = express();
mongoose.connect(config.mongoUrl);

initPassport(passport);

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
var youTubeclient = new youtube.Client(config.youTube);

app.set('port', process.env.PORT || 6500);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower',express.static(path.join(__dirname, 'bower_components')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

//SocketIO
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('play',function(videoId){
  	console.log('newVideo ' + videoId)
  	io.sockets.emit("newVideo",videoId);
	})
});



app.use('/', routes(io));
app.use('/video',videoRoutes);

app.get("/search",function(req,res){

	var term = req.query['q'];
	youTubeclient.search(term,function(data){
		res.json(data);
		res.end();
	});
});



var server = http.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
