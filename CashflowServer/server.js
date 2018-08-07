console.log('Iniciando Servidor...');

var express				= require('express');
//var multer				= require('multer');
//var bodyParser			= require('body-parser');
//var consolidate			= require('consolidate');
var Mongoose 			= require('mongoose');
var CashflowServer 		= express();
var http 				= require('http').Server(CashflowServer).listen(10205);

var SocketManager 		= require('./managers/SocketManager').getInstance(http);
//var EditorManager 		= require('./managers/EditorManager').getInstance();
//var ProjectManager 		= require('./managers/ProjectManager').getInstance();
//CashflowServer.engine('html', consolidate.swig);
//CashflowServer.set('view engine', 'html');
//CashflowServer.set('views', __dirname + '/views');

CashflowServer.use(function(request, response, next){
	response.header('Access-Control-Allow-Origin', "*");
	response.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
	response.header('Access-Control-Allow-Headers', "Authorization, X-Requested-With, Accept, Content-Type, Origin, Cache-Control, X-File-Name");
	next();
});

CashflowServer.use(express.static('./static'));

SocketManager.on('connection', function(socketConnection)
{
	// WaterDRop
	//socketConnection.on('sodimacWaterDrop', function(data){ SodimacWaterDrop.onSocketConnection(socketConnection, data); }.bind(this));
}.bind(this));

CashflowServer.get('/', function(request, response){ response.send('Servidor iniciado correctamente.'); });
//CashflowServer.get('/earth_day/:method/', EventManager.onJavaScriptHandler.bind(ProjectManager));
//CashflowServer.get('/js/:project', this.onJSHandler.bind(this));
/*CashflowServer.get('/js/:project/:group/scripts.js', ProjectManager.onJavaScriptHandler.bind(ProjectManager));
CashflowServer.get('/js/:project/:group/:size/scripts.js', ProjectManager.onJavaScriptHandler.bind(ProjectManager));
CashflowServer.get('/:project/:group/:size/:format', ProjectManager.onEditorRequestHandler.bind(ProjectManager));


CashflowServer.post('/upload',	multer(
{
	storage : multer.diskStorage(
	{
		destination: function (req, file, cb)
		{
			cb(null, 'public/static/' + req.body.path);
		},
		filename: function (req, file, cb)
		{
			cb(null, req.body.name);
		}
	})
}).single('bannerImage'), function (req, res, next)
{
    res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(req.file.originalname));
});*/

Mongoose.connect('mongodb://localhost/cashflow', function(error, response)
{
	if(error)
	{
		console.log("Error al iniciar la base de datos.");
		console.log("Error:", error);
	}
	else
	{
		console.log("Base de datos conectada correctamente.");

		//EditorManager.addEventListeners();
		//ProjectManager.addEventListeners();
		
		console.log("Servidor iniciado correctamente.");
	}
});