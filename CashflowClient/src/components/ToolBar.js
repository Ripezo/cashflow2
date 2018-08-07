var Library = require('./Library').getInstance();
var instance;

var ToolBar = function()
{
	console.log('new ToolBar();');
	this.container = $('#tool-bar');
	this.addElementsToDOM();
};

ToolBar.prototype.constructor = ToolBar;

ToolBar.prototype.addElementsToDOM = function()
{
	this.library = $('<button>', { id : 'library-toggle', html: 'Biblioteca' }).appendTo(this.container);
	this.library.on('click', function()
	{
		Library.toggle();
	});
};

ToolBar.prototype.show = function()
{
	this.container.animate({
		left: 0
	}, 300);
};

exports.getInstance = function()
{
	if(!instance) instance = new ToolBar();

	return instance;
};