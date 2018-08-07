var Settings 		= require('../Settings');
var Dropzone 		= require('dropzone');
var SocketManager 	= require('../managers/SocketManager').getInstance();
var ProjectManager 	= require('../managers/ProjectManager').getInstance();
var instance;

var Library = function()
{
	console.log('new Library();');
	this.opened = false;
	this.container = $('#library');
	

	this.addNewMaterial();
	this.addElementsToDOM();
};

Library.prototype.constructor = Library;

exports.getInstance = function()
{
	if(!instance) instance = new Library();
	return instance;
};



Library.prototype.addElementsToDOM = function()
{
	$('<button>', { id : 'dropzone-toggle', class: 'btn btn-default', 'data-toggle': 'modal', 'data-target': '#modalNewMaterial', html: 'Nuevo Material' }).appendTo(this.container);
};

Library.prototype.addNewMaterial = function()
{
	//console.log(this.parent.ProjectManager);

	this.modal = $('<div>', { id: 'modalNewMaterial', class: 'modal fade', role: 'dialog' });
	this.modal.appendTo($('body'));

	this.modalDialog = $('<div>', { class: 'modal-dialog modal-lg' });
	this.modalDialog.appendTo(this.modal);

	this.modalContent = $('<div>', { class: 'modal-content' });
	this.modalContent.appendTo(this.modalDialog);

	this.modalHeader = $('<div>', { class: 'modal-header', html: '<button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">Nuevo Material</h4>' });
	this.modalHeader.appendTo(this.modalContent);

	this.modalBody = $('<div>', { class: 'modal-body' });
	this.modalBody.appendTo(this.modalContent);

	this.dropzone = $('<form>', { id: 'dropzone-entity', class: 'dropzone', action: Settings.hostName + '/upload', method : 'post', enctype : 'multipart/form-data' }); //<form id="my-awesome-dropzone" action="/target" class="dropzone"></form>
	this.dropzone.appendTo(this.modalBody);

	this.nameInput = $('<div>', { class: 'calibration', html: '<div class="entity_source"></div><img class="reference" src="images/entity_reference.png">' });
	this.nameInput.appendTo(this.modalBody);

	this.modalFooter = $('<div>', { class: 'modal-footer' });
	this.modalFooter.appendTo(this.modalContent);

	this.dismiss = $('<button>', { type: 'button', class: 'btn btn-default', 'data-dismiss': 'modal', html: 'Cancelar' });
	this.dismiss.appendTo(this.modalFooter);

	this.action = $('<button>', { type: 'submit', class: 'btn btn-primary', 'data-dismiss': 'modal', html: 'Agregar' });
	this.action.appendTo(this.modalFooter);

	this.action.on('click', function(event)
	{
		event.preventDefault();
		//if(this.callbackFunction) this.callbackFunction(this.nameInput.val());

		console.log('nuevo material');
	}.bind(this));

	var myDropzone = new Dropzone('#dropzone-entity', {
		paramName 		: 'entitySource',
		url 			: Settings.hostName + '/upload',
		method 			: 'post',
		acceptedFiles 	: 'image/*',
		dictDefaultMessage : ''
	});

	this.modalBody.on('dragenter', function(event)
	{
		this.dropzone.show();
	}.bind(this));

	myDropzone.on('dragleave', function(event)
	{
		this.dropzone.hide();
	}.bind(this));

	myDropzone.on('sending', function(file, xhr, formData)
	{
		var path = ProjectManager.projectData._id;
		//console.log(path);
		//formData.append('path', this.projectData.path + this.groupData.id);
		//formData.append('name', file.name);
	}.bind(this));

	myDropzone.on('success', function(uploadData, imageName)
	{
		this.dropzone.hide();
		SocketManager.emit('addImage', {
			project: { id : this.projectData._id },
			group: { id: this.groupData.id },
			image : { name: imageName }
		});
	}.bind(this));

	this.dropzone.hide();
};

Library.prototype.toggle = function()
{
	console.log('toggle');
	var posX;
	if(this.opened)
	{
		this.opened = false;
		posX = -300;
	}
	else
	{
		this.opened = true;
		posX = 0;
	}

	this.container.stop().animate({
			right: posX+'px'
	}, 300);
};
