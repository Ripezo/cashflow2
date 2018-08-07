//var Moment			= require('moment');
var SocketManager 	= require('./SocketManager').getInstance();
var Project 		= require('../models/Project');
var Lodash			= require('lodash');
var EditorManager 	= require('./EditorManager').getInstance();
var FileSystem 		= require('fs');
var instance 		= null;

var GameManager = function()
{
	console.log('new GameManager();');
	this.projects = [];
};

GameManager.prototype.constructor = GameManager;

GameManager.prototype.addEventListeners = function()
{
	console.log('GameManager.addEventListeners();');
	SocketManager.on('connection', function(socketConnection)
	{
		console.log(socketConnection);
		socketConnection.on('getProjects', function(data){ this.getProjects(socketConnection, data); }.bind(this));
		socketConnection.on('addProject', function(data){ this.addProject(socketConnection, data); }.bind(this));
		socketConnection.on('openProject', function(data){ this.openProject(socketConnection, data); }.bind(this));
	}.bind(this));
};

GameManager.prototype.getProjects = function(socketConnection)
{
	Project.find(function(err, projectCollection)
	{
		socketConnection.emit('getProjects', projectCollection);
	});
};

GameManager.prototype.addProject = function(socketConnection, data)
{
	console.log(data);
	var currentEditor = Lodash.find(EditorManager.editors, function(editor)
	{
		return editor.socketId == socketConnection.id;
	});

	console.log(currentEditor);

	if(currentEditor)
	{
		var registerProject = new Project({
			name : data.name,
			author : currentEditor.id,
			created : new Date().getTime(),
			lastSave : new Date().getTime()
		});

		this.saveProject(registerProject);
		
		console.log('Un nuevo proyecto ha sido creado por ' + currentEditor.nickname + ' llamado ' + data.name + '.');
		console.log(registerProject);
		console.log('------');
		SocketManager.emit('addProject', { success : registerProject });
	}
	else
	{
		console.log('Intento de añadir un nuevo proyecto por usuario desconocido.', socketConnection.id);
		console.log('------');
		socketConnection.emit('addProject', { success : false, error : 'Error al añadir un nuevo projecto a la Base de Datos. Usuario desconocido.' });
	}
};

GameManager.prototype.saveProject = function(unsavedProject)
{
	unsavedProject.save(function (error, savedProject)
	{
		if(error)
		{
			console.log('Error al guardar el proyecto.', error);
		}
		else
		{
			console.log('Se han guardado cambios en el poyecto ' + savedProject.name + '.');
		}
	});
};

GameManager.prototype.openProject = function(socketConnection, data)
{
	console.log('openProject');

	var currentProject = Lodash.find(this.projects, function(project) { return project.id == data.project.id; });
	if(currentProject)
	{
		this.emitProjectData(socketConnection, currentProject);
	}
	else
	{
		Project.findOne({ _id : data.project.id }, function(error, projectFound)
		{
			if(projectFound)
			{
				this.projects.push(projectFound);
				this.emitProjectData(socketConnection, projectFound);
			}
			else
			{
				socketConnection.emit('openProject', { success : false, error : 'No se ha encontrado este proyecto en la base de datos.' });
			}
		}.bind(this));
	}
};

GameManager.prototype.emitProjectData = function(socketConnection, projectData)
{
	projectData.status = 'opened';
	projectData.markModified('status');
	socketConnection.join(projectData.id);
	socketConnection.emit('openProject', { success : projectData });

	// Create static folder
	var projectPath = './static';
	if(!FileSystem.existsSync(projectPath)) FileSystem.mkdirSync(projectPath);
	
	// Create projects folder
	projectPath += '/projects';
	if (!FileSystem.existsSync(projectPath)) FileSystem.mkdirSync(projectPath);
	
	// Create project folder
	projectPath += '/' + projectData._id;
	if (!FileSystem.existsSync(projectPath)) FileSystem.mkdirSync(projectPath);
};

GameManager.prototype.removeProject = function(socketConnection, data)
{
	var currentEditor = Lodash.find(EditorManager.editors, function(editor) { return editor.socketId == socketConnection.id; });
	
	if(currentEditor)
	{
		var currentProject = Lodash.find(this.projects, function(project) { return project.id == data.project.id; });
		
		if(currentProject)
		{
			if(currentProject.status != 'closed')
			{
				socketConnection.emit('removeProject', {
					success : false,
					error : 'Este proyecto está en uso actualmente.'
					});
				return;
			}
			else
			{
				Lodash.remove(this.projects, function(project) { return project.id == data.project.id; });
			}
		}
		
		Project.findOne({ _id : data.project.id }, function(error, projectFound)
		{
			if(projectFound)
			{
				if(currentEditor.id == projectFound.author)
				{
					projectFound.remove(function(error)
					{
					    if(!error)
					    {
					    	this.removeFolder('public/static' + projectFound.path);
					        console.log('El proyecto ' + projectFound.name + ' de ' + projectFound.clientName + ' ha sido borrado por ' + currentEditor.nickname + '.');
							console.log('------');
							SocketManager.emit('removeProject', { success : data });
					    }
					    else
					    {
					        socketConnection.emit('removeProject', { success : false, error : 'No se pudo remover este proyecto en la base de datos.' });
					    }
					}.bind(this));
				}
				else
				{
					socketConnection.emit('removeProject', {
						success : false,
						error : 'No tienes permisos para eliminar este proyecto.'
					});
				}
			}
			else
			{
				socketConnection.emit('removeProject', { success : false, error : 'No se ha encontrado este proyecto en la base de datos.' });
			}
		}.bind(this));
	}
	else
	{
		console.log('Intento de eliminar un proyecto por usuario desconocido.', socketConnection.id);
		console.log('------');
		socketConnection.emit('openProject', { success : false, error : 'Error al eliminar un projecto a la Base de Datos. Usuario desconocido.' });
	}
};

GameManager.prototype.addGroup = function(socketConnection, data)
{
	var currentProject = Lodash.find(this.projects, function(project) { return project.id == data.project.id; });
	if(currentProject)
	{
		currentProject.groups.push({ id: data.group.id, html: '', css: '', js: '', clickTag: '', banners: [], images: [] });
		currentProject.markModified('groups');

		// Create group folder
		var groupPath = './public/static' + currentProject.path + data.group.id;
		if (!FileSystem.existsSync(groupPath)) FileSystem.mkdirSync(groupPath);

		SocketManager.to(data.project.id).emit('addGroup',
		{
			success : data
		});
		
		this.saveProject(currentProject);
	}
	else
	{
		SocketManager.to(data.project.id).emit('addGroup',
		{
			success : false,
			error : ('Error al añadir un nuevo grupo a este proyecto.')
		});
	}
};

GameManager.prototype.removeGroup = function(socketConnection, data)
{
	var currentProject = Lodash.find(this.projects, function(project) { return project.id == data.project.id; });
	if(currentProject)
	{
		var currentGroup = Lodash.find(currentProject.groups, function(group) { return group.id == data.group.id; });
		if(currentGroup)
		{
			Lodash.remove(currentProject.groups, function(group) { return group.id == data.group.id; });
			currentProject.markModified('groups');

			this.removeFolder('public/static' + currentProject.path + data.group.id);

			SocketManager.to(data.project.id).emit('removeGroup',
			{
				success : data
			});
			this.saveProject(currentProject);
		}
		else
		{
			SocketManager.to(data.project.id).emit('removeGroup',
			{
				success : false,
				error : ('Error al remover el grupo #' + data.group.id + ' del proyecto con id: ' + data.project.id)
			});
		}
	}
	else
	{
		SocketManager.to(data.project.id).emit('removeGroup',
		{
			success : false,
			error : ('Error al remover el grupo #' + data.group.id + ' del proyecto con id: ' + data.project.id)
		});
	}
};

GameManager.prototype.removeFolder = function(path, recursive)
{
	if(FileSystem.existsSync(path))
	{
		FileSystem.readdirSync(path).forEach(function(file, index)
		{
			var curPath = path + "/" + file;
			if(FileSystem.lstatSync(curPath).isDirectory())
			{ 
				this.removeFolder(curPath);
			}
			else
			{
				FileSystem.unlinkSync(curPath);
			}
		}.bind(this));
		FileSystem.rmdirSync(path);
	}
};

GameManager.prototype.saveClickTag = function(socketConnection, data)
{
	var currentProject = Lodash.find(this.projects, function(project) { return project.id == data.project.id; });
	if(currentProject)
	{
		var currentGroup = Lodash.find(currentProject.groups, function(group) { return group.id == data.group.id; });
		if(currentGroup)
		{
			currentGroup.clickTag = data.clickTag.id;
			currentProject.markModified('groups');
			this.saveProject(currentProject);
		}
	}
};

GameManager.prototype.saveHTMLCode = function(socketConnection, data)
{
	var currentProject = Lodash.find(this.projects, function(project) { return project.id == data.project.id; });
	if(currentProject)
	{
		var currentGroup = Lodash.find(currentProject.groups, function(group) { return group.id == data.group.id; });
		currentGroup.html = data.code.value;
		currentProject.markModified('groups');
		SocketManager.to(data.project.id).emit('onChangeHTMLCode',
		{
			success : { group: { id: data.group.id, html: data.code.value } }
		});
	}
};

GameManager.prototype.saveCSSCode = function(socketConnection, data)
{
	var currentProject = Lodash.find(this.projects, function(project) { return project.id == data.project.id; });
	if(currentProject)
	{
		var currentGroup = Lodash.find(currentProject.groups, function(group) { return group.id == data.group.id; });
		currentGroup.css = data.code.value;
		currentProject.markModified('groups');
		SocketManager.to(data.project.id).emit('onChangeCSSCode',
		{
			success : { group: { id: data.group.id, css: data.code.value } }
		});
	}
};

GameManager.prototype.saveJSCode = function(socketConnection, data)
{
	var currentProject = Lodash.find(this.projects, function(project) { return project.id == data.project.id; });
	if(currentProject)
	{
		var currentGroup = Lodash.find(currentProject.groups, function(group) { return group.id == data.group.id; });
		currentGroup.js = data.code.value;
		currentProject.markModified('groups');
	}
};

GameManager.prototype.addBanner = function(socketConnection, data)
{
	var currentProject = Lodash.find(this.projects, function(project) { return project.id == data.project.id; });
	if(currentProject)
	{
		var currentGroup = Lodash.find(currentProject.groups, function(group) { return group.id == data.group.id; });
		if(currentGroup)
		{
			currentGroup.banners.push(data.banner);
			currentProject.markModified('groups');
			SocketManager.to(data.project.id).emit('addBanner',
			{
				success : data
			});
			this.saveProject(currentProject);
		}
		else
		{
			SocketManager.to(data.project.id).emit('addBanner',
			{
				success : false,
				error : ('Error al añadir un nuevo banner al grupo #' + data.group.id + ' del proyecto con id: ' + data.project.id)
			});
		}
	}
	else
	{
		socketConnection.emit('addBanner',
		{
			success : false,
			error : 'Error al añadir un nuevo banner a este grupo.'
		});
	}
};

GameManager.prototype.onJavaScriptHandler = function(req, res)
{
	// Params: '/js/:project/:group/:size'

	var dbQuery = this.getProjectData(req.params.project);
	var projectData = dbQuery.success;
	var groupData = Lodash.find(projectData.groups, function(group) { return group.id == req.params.group; });
	var jsCode = groupData.js;
	var query = '';	
	var sustituto = '';

	if(req.params.size)
	{
		query = /\$\(\'/gi;	
		sustituto = '$(\'.banner_' + req.params.size + ' ';
		jsCode = jsCode.replace(query, sustituto);

		query = /\$\(\"/gi;	
		sustituto = '$(\".banner_' + req.params.size + ' ';
		jsCode = jsCode.replace(query, sustituto);
	}
	else
	{
		query = /\$\(\'/gi;	
		sustituto = '$(\'#' + req.params.group + ' ';
		jsCode = jsCode.replace(query, sustituto);

		query = /\$\(\"/gi;	
		sustituto = '$(\"#' + req.params.group + ' ';
		jsCode = jsCode.replace(query, sustituto);
	}

	res.send(jsCode);
};

GameManager.prototype.onEditorRequestHandler = function(req, res)
{
	// Params: '/:project/:group/:size/:format'

	// Agregar un script para abrir el projecto cuando no está en uso.

	var dbQuery = this.getProjectData(req.params.project);
	var projectData = dbQuery.success;
	var groupData = Lodash.find(projectData.groups, function(group) { return group.id == req.params.group; });
	var template = JSON.parse(FileSystem.readFileSync('./templates/BannerHTML5.json', 'utf8'));
	var bannerData = template.bannerTemplate;
	var clickTagData;
	
	switch(groupData.clickTag)
	{
		case 'weborama':
		{
			clickTagData = template.clickTag.weborama;
			break;
		}
		
		case 'googledisplay':
		{
			clickTagData = template.clickTag.googledisplay;
			break;
		}
		
		case 'googledcm':
		{
			clickTagData = template.clickTag.googledcm;
			break;
		}
		
		default:
		{
			console.log(projectData.clickTag);
			clickTagData = false;
			break;
		}
	}
	
	var formatSize = req.params.size.split('x');

	var htmlTemplate = template.html.toString().replace(new RegExp('{size}', 'gi'), req.params.size);
		htmlTemplate = htmlTemplate.replace('{clientName}', projectData.clientName);
		htmlTemplate = htmlTemplate.replace('{projectName}', projectData.name);
		htmlTemplate = htmlTemplate.replace('{group}', req.params.group);
		
		if(clickTagData)
		{
			htmlTemplate = htmlTemplate.replace('{clickTagHeader}', clickTagData.header);
		}
		else
		{
			htmlTemplate = htmlTemplate.replace('{clickTagHeader}', '');
		}
		
		htmlTemplate = htmlTemplate.replace(new RegExp('{width}', 'gi'), formatSize[0].toString());
		htmlTemplate = htmlTemplate.replace(new RegExp('{height}', 'gi'), formatSize[1].toString());
		
		if(groupData.css)
		{
			htmlTemplate = htmlTemplate.replace('{css}', groupData.css);
		}
		else
		{
			htmlTemplate = htmlTemplate.replace('{css}', '');
		}

		if(clickTagData)
		{
			htmlTemplate = htmlTemplate.replace('{onClick}', clickTagData.onClick);
		}
		else
		{
			htmlTemplate = htmlTemplate.replace('{onClick}', '');
		}
		
		if(groupData.html)
		{
			htmlTemplate = htmlTemplate.replace('{html}', groupData.html);
		}
		else
		{
			htmlTemplate = htmlTemplate.replace('{html}', '');
		}
		
		if(groupData.js)
		{
			htmlTemplate = htmlTemplate.replace('{js}', groupData.js);
		}
		else
		{
			htmlTemplate = htmlTemplate.replace('{js}', '');
		}
		
	switch(req.params.format)
	{
		case 'html':
		{
			res.send(htmlTemplate);
			break;
		}

		case 'zip':
		{
			var zip = new require('node-zip')();
			zip.file(req.params.size + '/index.html', htmlTemplate);
			
			for(var index = 0; index < groupData.images.length; index++)
			{
				var imageURL = groupData.images[index];
				var imageData = FileSystem.readFileSync('public/static' + projectData.path + groupData.id + '/' + imageURL);
				var splitedImageName = imageURL.split('/');
				var imageZipPath = req.params.size + '/' + imageURL;
				zip.file(imageZipPath, imageData);
			}
			
			var data = zip.generate({base64: false, compression:'DEFLATE'});
			//var zipName = Moment().format('YYYYMMDD') + '_' + projectData.clientSlug + '_' + projectData.slug;
			var zipName = req.params.size;
			
			res.set('Content-Type', 'application/zip')
			res.set('Content-Disposition', 'attachment; filename=' + zipName + '.zip');
			res.set('Content-Length', data.length);
			res.end(data, 'binary');
			break;
		}

		default:
		{
			res.send('Requerimiento desconocido.');
			break;
		}
	}
};

GameManager.prototype.getProjectData = function(projectID)
{
	var currentProject = Lodash.find(this.projects, function(project) { return project.id == projectID });
	if(currentProject)
	{
		return { success: currentProject };
	}
	else
	{
		Project.findOne({ _id : projectID }, function(error, projectFound)
		{
			if(projectFound)
			{
				//this.projects.push(projectFound);
				return { success: projectFound };
			}
			else
			{
				return { success: false, error: 'No existe proyecto con id: ' + projectID };
			}
		}.bind(this));
	}
};

GameManager.prototype.removeBanner = function(socketConnection, data)
{
	var currentProject = Lodash.find(this.projects, function(project) { return project.id == data.project.id; });
	if(currentProject)
	{
		var currentGroup = Lodash.find(currentProject.groups, function(group) { return group.id == data.group.id; });
		if(currentGroup)
		{		
			Lodash.remove(currentGroup.banners, function(banner) { return banner.id == data.banner.id; });
			currentProject.markModified('groups');
			SocketManager.to(data.project.id).emit('removeBanner', { success : data } );
			this.saveProject(currentProject);
		}
		else
		{
			SocketManager.to(data.project.id).emit('removeBanner',
			{
				success : false,
				error : ('Error al remover el banner del grupo #' + data.group.id + '.')
			});
		}
	}
	else
	{
		SocketManager.to(data.project.id).emit('removeBanner',
		{
			success : false,
			error : ('Error al remover el banner del proyecto con id: ' + data.project.id)
		});
	}
};

GameManager.prototype.addImage = function(socketConnection, data)
{
	var currentProject = Lodash.find(this.projects, function(project) { return project.id == data.project.id; });
	if(currentProject)
	{
		var currentGroup = Lodash.find(currentProject.groups, function(group) { return group.id == data.group.id; });
		if(currentGroup)
		{
			
			if(Lodash.find(currentGroup.images, function(image) { console.log(image, data.image.name); return image == data.image.name; }))
			{
				SocketManager.to(data.project.id).emit('addImage', { success : false, error: 'La imagen fue reemplazada con exito.' });
			}
			else
			{
				currentGroup.images.push(data.image.name);
				SocketManager.to(data.project.id).emit('addImage', { success : data });

				console.log(currentGroup.images);
			}
		}
		else
		{
			SocketManager.to(data.project.id).emit('addImage',
			{
				success : false,
				error : ('Error al agregar una imagen al grupo con id: #' + data.group.id)
			});
		}
	}
	else
	{
		SocketManager.to(data.project.id).emit('addImage',
		{
			success : false,
			error : ('Error al agregar una imagen al proyecto con id: ' + data.project.id)
		});
	}
};

GameManager.prototype.removeImage = function(socketConnection, data)
{
	var currentProject = Lodash.find(this.projects, function(project) { return project.id == data.project.id; });
	if(currentProject)
	{
		var currentGroup = Lodash.find(currentProject.groups, function(group) { return group.id == data.group.id; });
		if(currentGroup)
		{
			var imagePath = './public/static' + data.project.path + data.group.id + '/' + data.image.name;
			if(FileSystem.existsSync(imagePath)) FileSystem.unlinkSync(imagePath);
			
			if(Lodash.find(currentGroup.images, function(image) { return image == data.image.name; }))
			{
				Lodash.remove(currentGroup.images, function(image) { return image == data.image.name; })
			}
			
			SocketManager.to(data.project.id).emit('removeImage', { success : data });
		}
		else
		{
			SocketManager.to(data.project.id).emit('removeImage',
			{
				success : false,
				error : ('Error al remover una imagen del grupo con id: #' + data.group.id)
			});
		}
	}
	else
	{
		SocketManager.to(data.project.id).emit('removeImage',
		{
			success : false,
			error : ('Error al remover una imagen del proyecto con id: ' + data.project.id)
		});
	}
};

/*
SocketManager.prototype.autoSaveHandler = function()
{
	console.log('Autosave();');
	var date = new Date();
	for(var indice in this.projects)
	{
		var unsavedProject = this.projects[indice];
		var timeAgo = new Date(date.getTime() - unsavedProject.lastSave);

		if(timeAgo.getMinutes() > 1) // Si ha pasado más de 1 minuto sin guardar
		{
			unsavedProject.lastSave = date.getTime();
			unsavedProject.save(function (error, savedProject)
			{
				if(error)
				{
					console.log(error);
				}
				else
				{
					console.log('Proyecto ' + savedProject.name + ' ha sido guardado con éxito.');
					console.log(savedProject);
				}
			});
		}
	}
};
*/

GameManager.prototype.saveAndExit = function(socketConnection, data)
{
	var currentProject = Lodash.find(this.projects, function(project) { return project.id == data.project.id; });
	if(currentProject)
	{
		currentProject.status = 'closed';
		currentProject.markModified('status');
		currentProject.save(function (error, savedProject)
		{
			if(error)
			{
				console.log(error);
			}
			else
			{
				console.log('Proyecto ' + savedProject.name + ' ha sido guardado con éxito.');
				console.log(savedProject);
			}
		});
	}
};

exports.getInstance = function ()
{
	if (instance == null) instance = new GameManager();
	return instance;
};