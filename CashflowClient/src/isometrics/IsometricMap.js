var Game 				 = require('./Game').getInstance();
var Isometric 			 = require('../isometrics/Isometric');
var IsometricLayer 		 = require('./IsometricLayer');
var IsometricPoint 		 = require('./IsometricPoint');
var IsometricHelpers 	 = require('./IsometricHelpers');
var IsometricMapSettings = require('./IsometricMapSettings');

var IsometricMap = function()
{
	Phaser.Sprite.call(this, Game, 0, 0); // Extends

	console.log('new IsometricMap();');

	/*this.inputEnabled = true;
	this.input.priorityID = 0;
	this.input.useHandCursor = true;
	this.events.onInputDown.add(this.onDownHandler, this);
	this.events.onDragStop.add(this.onDragUpdateHandler, this);
	//Game.input.addPointer();
	this.resize();*/
}

IsometricMap.prototype = Object.create(Phaser.Sprite.prototype);
IsometricMap.prototype.constructor = IsometricMap;

/*IsometricMap.prototype.getIsometricLayer = function(layerId)
{
	for(var index in this.children)
	{
		var layerInstance = this.children[index];
		
		if(layerId == layerInstance.data._id)
		{
			return layerInstance;
		}
	}
};

IsometricMap.prototype.onDragUpdateHandler = function()
{
	for(var index in this.children)
	{
		var isometricInstance = this.children[index];
		console.log('Layer Actualizado:', isometricInstance.data._id);

		isometricInstance.resize();
	}
};

IsometricMap.prototype.onDownHandler = function()
{
	var isometricPoint = new IsometricPoint(this.activeLayer.mouseX, this.activeLayer.mouseY);

	if(this.activeLayer) this.activeLayer.updateIsometricPointer();

	switch(Game.toolbar.currentTool)
	{
		case 'paint':
		{
			if(this.activeLayer)
			{
				if(Game.editor.activeMaterial)
				{
					Game.editorSocket.emit('addTile',
					{
						project : { id : Game.projectData._id },
						layer : { id : this.activeLayer.data._id },
						entity : { id : isometricPoint.x + 'x' + isometricPoint.y, x : isometricPoint.x, y : isometricPoint.y },
						tile : { id : Game.editor.activeMaterial, height : 50 }
					});
				}
				else
				{
					alert('Primero debes seleccionar un material.');
					Game.toolbar.openTileManager();
				}
				
			}
			break;
		}
		
		case 'eraser':
		{
			if(this.activeLayer)
			{
				Game.editorSocket.emit('removeTile',
				{
					project : { id : Game.projectData._id },
					layer : { id : this.activeLayer.data._id },
					entity : { id : isometricPoint.x + 'x' + isometricPoint.y },
					tile : { id : 'LastOne' }
				});
			}
			break;
		}
		
		default:
		{
			
			break;
		}
	}
};

IsometricMap.prototype.addLayer = function(layerData)
{
	var isometricLayer = new IsometricLayer(this.children.length, layerData);
	this.addChild(isometricLayer);
	return isometricLayer;
};

IsometricMap.prototype.removeLayer = function(layerId, callbackFunction)
{
	Game.isometricMap.children.forEach(function(layerInstance, positionIndex)
	{
		if(this.activeLayer && this.activeLayer.data._id == layerId)
		{
			this.activeLayer = null;
		}

		if(layerInstance.data._id == layerId)
		{
			layerInstance.destroy();
		}
	}.bind(this));

	if(callbackFunction) callbackFunction();
};

IsometricMap.prototype.startDrag = function()
{
    this.input.enableDrag();
};

IsometricMap.prototype.stopDrag = function()
{
    this.input.disableDrag();
};

IsometricMap.prototype.resize = function()
{
	if(Game.isometricMap)
	{
		Game.isometricMap.children.forEach(function(layerInstance, positionIndex)
		{
			layerInstance.resize();
		});
	}
};*/

module.exports = IsometricMap;