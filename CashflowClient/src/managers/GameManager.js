var SocketManager 	= require('./SocketManager').getInstance();
var Modal 			= require('../components/Modal');
var Lodash			= require('lodash');
var IsometricMap 	= require('../isometrics/IsometricMap');
var instance;

var GameManager = function()
{

};

GameManager.prototype.constructor = GameManager;

exports.getInstance = function()
{
	if(!instance) instance = new GameManager();
	return instance;
};

/*var KeyboardEvent 	= require('../components/KeyboardEvent').getInstance();
var MouseEvent 		= require('../components/MouseEvent').getInstance();
var AutoSaver 		= require('../components/AutoSaver').getInstance();
var Warning 		= require('../components/Warning').getInstance();
*/

GameManager.prototype.addUserInterface = function()
{
	console.log('GameManager.addUserInterface();');
	this.projectsContainer = $('#projects');
	this.projectsContainer.empty();

	this.title = $('<h2>', { class: 'section-title', html: 'Proyectos' });
	this.title.appendTo(this.projectsContainer);

	this.addProjectButton = $('<button>', { class: 'btn btn-primary', html: 'Nuevo Proyecto', 'data-toggle': 'modal', 'data-target': '#addProjectModal' }); //<button class="btn btn-primary" type="submit">Button</button>
	this.addProjectButton.appendTo(this.projectsContainer);

	var modal = new Modal('addProjectModal', 'Agregar un nuevo proyecto', 'Escribe un nombre aquí...', 'Agregar', this.addProjectButtonHandler.bind(this));

	this.projectList = $('<ul>', { id: 'projectList', class: 'row cf' });
	this.projectList.appendTo(this.projectsContainer);

	$('#client-list').remove();
	this.clientList = $('<ul>', { id: 'client-list', class: 'row cf' });
	this.clientList.appendTo($('#emily-container'));

	this.addEventListeners();
};

GameManager.prototype.addProjectButtonHandler = function(projectName)
{
	console.log(projectName);
	SocketManager.emit('addProject',
	{
		name : projectName,
		slug : this.toSlug(projectName)
	});
};

GameManager.prototype.addEventListeners = function()
{
	SocketManager.on('getProjects', this.displayProjectsHandler.bind(this));
	SocketManager.emit('getProjects');

	SocketManager.on('addProject', this.addProject.bind(this));
	SocketManager.on('openProject', this.openProject.bind(this));
	

	$(document).keydown(function(event)
	{
		switch(event.keyCode)
		{
			case 83:
			{
				if(KeyboardEvent.cmd)
				{
					event.preventDefault();
					//console.log('saveAndContinue();');

					/*SocketManager.emit('saveAndContinue', {
						project : { id : this.projectData._id }
					});*/
				} 
				break;
			}

			default:
			{
				////console.log('keydown', event.keyCode);
				break;
			}
		}
	}.bind(this));

	window.onfocus = function(event)
	{
		KeyboardEvent.cmd = false;
		KeyboardEvent.shift = false;
	};

	window.onblur = function(event)
	{
		
	};
};

GameManager.prototype.displayProjectsHandler = function(projectArray)
{
	console.log('displayProjectsHandler();');
	//console.log(projectArray);
	if(this.projectList) this.projectList.empty();

	for(var index in projectArray)
	{
		var data = {};
		data.success = projectArray[index];
		this.addProject(data);
	}
};

GameManager.prototype.addProject = function(data)
{
	console.log('addProject();');
	var projectData = data.success;
	if(projectData)
	{
		console.log(projectData);
		var project = $('<li>', { id: projectData._id, class: 'col-xs-6 col-sm-4 col-md-2' });
			project.appendTo(this.projectList);

		var projectButton = $('<button>', { class : 'project-button', html : projectData.name, 'data-project-id' : projectData._id });
			projectButton.appendTo(project);
			projectButton.on('click', function()
			{
				var projectID = $(this).data('project-id');
				SocketManager.emit('openProject',
				{
					project : {
						id : projectID
					}
				});
			});
	}
	else
	{
		//Warning.alert(data.error);
	}
};

GameManager.prototype.openProject = function(data)
{
	console.log('openProject();');
	if(data.success)
	{
		// Hide Top-bar
		$('#top-bar').animate({
			top: -($('#top-bar').height())
		}, 300);

		// Hide Footer
		$('#bottom-bar').animate({
			bottom : -($('#bottom-bar').height())
		}, 300);

		this.projectData = data.success;
		this.projectsContainer.fadeOut(300, function()
		{
			//AutoSaver.activity();
			this.loadProjectData(data.success);
		}.bind(this));
	}
	else
	{
		//Warning.alert(data.error);
	}
};

GameManager.prototype.loadProjectData = function(data)
{
	console.log('loadProjectData();');
	console.log(data);

	this.projectData = data;

	this.toolBar = require('../components/ToolBar').getInstance();
	this.library = require('../components/Library').getInstance();
	this.isometricMap = new IsometricMap();
	this.toolBar.show();




	//this.addCloseButton();

	//$('<h2>', { html: data.clientName + ' ' + data.name, class: 'project-title' }).appendTo(this.emilyContainer);

	/*var tableHtml = '';
		tableHtml += '<tr><td>Autor:</td><td>' + data.authorName + '</td></tr>';
	$('<table>', { id: 'project_information', html: tableHtml }).appendTo(this.emilyContainer);*/

	// Add New Group
	/*$('<div >', { id: 'add_banner_group', html: '<button class="add_element" tittle="Agregar un nuevo grupo de banners"><button /><br>Agregar Grupo' }).appendTo(this.emilyContainer);
	$('#add_banner_group').on('click', this.addGroupHandler.bind(this));*/

	/*this.groups = [];
	this.banners = [];

	$.each(this.projectData.groups, function(indice, group)
	{
		this.addGroup({ success: { group } });
	}.bind(this));*/
};

GameManager.prototype.toSlug = function(stringValue)
{
  stringValue = stringValue.replace(/^\s+|\s+$/g, ''); // trim
  stringValue = stringValue.toLowerCase();
  
  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to   = "aaaaeeeeiiiioooouuuunc------";
  for (var i=0, l=from.length ; i<l ; i++) {
    stringValue = stringValue.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  stringValue = stringValue.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '_') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return stringValue;
};

/*GameManager.prototype.onChangeHTMLCodeHandler = function(data)
{
	if(data.success)
	{
		var groupObject = Lodash.find(this.groups, function(group){ return group.groupData.id == data.success.group.id; });
		groupObject.updateHTMLCode(data.success.group.html);
	}
	else
	{
		Warning.alert(data.error);
	}
};

GameManager.prototype.onChangeCSSCodeHandler = function(data)
{
	if(data.success)
	{
		var groupObject = Lodash.find(this.groups, function(group){ return group.groupData.id == data.success.group.id; });
		groupObject.updateCSSCode(data.success.group.css);
	}
	else
	{
		Warning.alert(data.error);
	}
};



GameManager.prototype.removeProject = function(data)
{
	//console.log('removeProject();');
	if(data.success)
	{
		$('#' + data.success.project.id).fadeOut(300, function()
		{
			$(this).remove();
		});
	}
	else
	{
		Warning.alert(data.error);
	}
};

GameManager.prototype.addCloseButton = function()
{
	if(this.closeProjectButton)
	{
		this.closeProjectButton.show();
	}
	else
	{
		this.closeProjectButton = $('<button>', { id: 'close-project', html: 'Guardar y Salir' });
		this.closeProjectButton.appendTo(this.emilyContainer);
		this.closeProjectButton.on('click', this.closeProject.bind(this));
	}
};

GameManager.prototype.closeProject = function()
{
	AutoSaver.lastActivity = 0;
	SocketManager.emit('saveAndExit', {
		project : { id : this.projectData._id }
	});
	document.location.reload(true);
};

GameManager.prototype.addImage = function(data)
{
	//console.log('GameManager.addImage();');

	if(data.success)
	{
		var groupObject = Lodash.find(this.groups, function(group){ return group.groupData.id == data.success.group.id; });

		if(Lodash.find(groupObject.imageGallery.images, function(image) { return image == data.success.image.name; }))
		{
			groupObject.updateHTMLCode();
			groupObject.updateCSSCode();
		}
		else
		{
			//console.log('no existe');
			groupObject.groupData.images.push(data.success.image.name);
		}

		groupObject.imageGallery.addImage(data.success.image);
	}
	else
	{
		Warning.alert(data.error);
	}
};

GameManager.prototype.removeImage = function(data)
{
	//console.log('removeImage();');

	if(data.success)
	{
		var groupObject = Lodash.find(this.groups, function(group){ return group.groupData.id == data.success.group.id; });
			Lodash.remove(groupObject.groupData.images, function(imageName){ return imageName == data.success.image.name; });
			groupObject.imageGallery.removeImage(data.success.image.name);

			groupObject.updateCSSCode();
			groupObject.updateHTMLCode();
	}
	else
	{
		Warning.alert(data.error);
	}
};

GameManager.prototype.addGroupHandler = function(event)
{
	if(!$('#add_group_panel').length)
	{
		var addGroupForm = '';

		addGroupForm += '<div class="remover button">X</div><h2>Nuevo Grupo</h2>';
		addGroupForm += '<table>';
		addGroupForm += '<tr><td><input id="group_name" type="text" placeholder="Nombre de grupo"></td></tr>';
		addGroupForm += '<tr><td><button id="add_group_ready">Crear</button></td></tr>';
		addGroupForm += '</table>';

		var newGroupPanel = $('<form>', { id: 'add_group_panel', class: 'add_panel', style: ('top:' + (window.innerHeight >> 1) + 'px'), html: addGroupForm });
		newGroupPanel.appendTo($('body'));

		$('#group_name').focus();

		newGroupPanel.submit(function(event)
		{
			event.preventDefault();

			$('#add_group_panel .error').remove();

			if(!$('#group_name').val())
			{
				$('#group_name').shake();
				if(!$('#group_error').length) $('<span>', { id: 'group_error', class: 'error', html: 'Debes asignar un nombre al grupo.' }).insertAfter('#group_name');
			}
			else
			{
				var nameGroup = this.toSlug($('#group_name').val());
				//console.log(nameGroup);
				SocketManager.emit('addGroup', { 
					project : { id : this.projectData._id },
					group : { id : nameGroup }
				});

		    	$('#add_group_panel').remove();
			}
		}.bind(this));

		$('#add_group_panel .remover').on('click', function()
		{
			$('#add_group_panel').remove();
		});
	}
};

GameManager.prototype.addGroup = function(data)
{
	//console.log('addGroup();');
	if(data.success)
	{
		this.groups.push(new BannerGroup(this.projectData, data.success.group));
	}
	else
	{
		Warning.alert(data.error);
	}
};

GameManager.prototype.removeGroup = function(data)
{
	//console.log('removeGroup();');
	if(data.success)
	{
		Lodash.remove(this.groups, function(group){ return group.groupData.id == data.success.group.id; });
		$('#' + data.success.group.id).remove();
	}
	else
	{
		Warning.alert(data.error);
	}
};

GameManager.prototype.addBanner = function(data)
{
	//console.log('addBanner();');
	
	if(data.success)
	{
		var groupObject = Lodash.find(this.groups, function(group){ return group.groupData.id == data.success.group.id; });

		if(groupObject)
		{
			groupObject.addBanner(data.success.banner);
		}
		else
		{
			//console.log('Error. No se encontró el grupo con id: #' + data.success.group.id);
		}
	}
	else
	{
		Warning.alert(data.error);
	}
};

GameManager.prototype.removeBanner = function(data)
{
	//console.log('removeBanner();');

	if(data.success)
	{
		var groupObject = Lodash.find(this.groups, function(group){ return group.groupData.id == data.success.group.id; });
		if(groupObject)
		{
			groupObject.removeBanner(data.success.banner);
		}
		else
		{
			//console.log('Error. No se encontró el grupo con id: #' + data.success.group.id);
		}
	}
	else
	{
		Warning.alert(data.error);
	}
};

GameManager.prototype.addProjectPanel = function(event)
{
	if(!$('#add_project_panel').length)
	{
		var addProjectForm = '';

		addProjectForm += '<div class="remover button">X</div><h2>Nuevo Proyecto</h2>';
		addProjectForm += '<table>';
		addProjectForm += '<tr><td><select id="client_list"></select></td></tr>';
		addProjectForm += '<tr><td><input id="campaign_name" type="text" placeholder="Nombre de campaña"></td></tr>';
		addProjectForm += '<tr><td><button id="add_project_ready">Crear</button></td></tr>';
		addProjectForm += '</table>';

		var newProjectPanel = $('<form>', { id: 'add_project_panel', html: addProjectForm });
		newProjectPanel.appendTo($('body'));

		var clients = [
			{val : '', text: 'Selecciona un cliente...'},
			{val : 'casacostanera', text: 'Casa Costanera'},
			{val : 'falabella', text: 'Falabella'},
			{val : 'santander', text: 'Santander'},
			{val : 'lbel', text: "L'bel"},
			{val : 'sura', text: "Sura"}
		];

		$(clients).each(function(){ $('#client_list').append($("<option>").attr('value', this.val).text(this.text)); });

		newProjectPanel.submit(function(event)
		{
			event.preventDefault();

			$('#add_project_panel .error').remove();

			if(!$('#client_list').val())
			{
				$('#client_list').shake();
				if(!$('#client_error').length) $('<span>', { id: 'client_error', class: 'error', html: 'Debes asociar un cliente al proyecto.' }).insertAfter('#client_list');
			}
			else if(!$('#campaign_name').val())
			{
				$('#campaign_name').shake();
				if(!$('#campaign_error').length) $('<span>', { id: 'client_error', class: 'error', html: 'Debes asignar un nombre a la campaña.' }).insertAfter('#campaign_name');
			}
			else
			{
				var campaignName = $('#campaign_name').val();
		    	var campaignSlug = this.toSlug(campaignName);
		    	var clientName = $("#client_list option:selected").text();
		    	var clientSlug = $('#client_list').val();
		    	SocketManager.emit('addProject', {
		    		name : campaignName,
		    		slug: campaignSlug,
		    		clientName: clientName,
		    		clientSlug: clientSlug
		    	});

		    	$('#add_project_panel').remove();
			}
		}.bind(this));

		$('#add_project_panel .remover').on('click', function()
		{
			$('#add_project_panel').remove();
		});
	}
};

GameManager.prototype.onProjectChangeHandler = function()
{
	$.each(this.groups, function(indice, groupObject)
	{
		groupObject.setStyleGroup(groupObject.groupData.css);
		groupObject.updateHTMLCode(groupObject.groupData.html);
		groupObject.removeAnimation();
	});
};

GameManager.prototype.showBannerPreview = function(bannerID)
{
	if(bannerID)
	{
		var banner = $('.banner_' + bannerID);
		var bannerIframe = banner.find('.dynamic-iframe');
		var src = bannerIframe.attr('src');
		bannerIframe.show();
		bannerIframe.attr('src', src);
	}
	else
	{
		$.each($('.dynamic-iframe'), function()
		{
			var src = $(this).attr('src');
			$(this).attr('src', src);
		});
	}
};


*/
