var Game = require('./Game');
var IsometricEntity = require('./IsometricEntity');
var IsometricHelpers = require('./IsometricHelpers');
var IsometricMapSettings = require('./IsometricMapSettings');

var IsometricLayer = function(indice, layerData)
{
	Phaser.Sprite.call(this, Game, 0, -(indice * 3 * (IsometricMapSettings.tileSize >> 1))); // Extends
	this.data = layerData;
	this.name = IsometricMapSettings.layerTitlePrefix + indice;
	console.log('A new Dynamic Isometric Layer has been created.', this.name);

 	this.addEntityContainer();
 	this.loadLayerData();
 	this.addPivot();

	this.update();

	this.hideIsometricPointer();

	this.activeLayer(false);

	setTimeout(this.resize.bind(this), 100);
};

IsometricLayer.prototype = Object.create(Phaser.Sprite.prototype);
IsometricLayer.prototype.constructor = IsometricLayer;

IsometricLayer.prototype.addEntityContainer = function()
{
	this.entityContainer = new Phaser.Group(Game, this, 'EntityContainer');
	this.addChild(this.entityContainer);
};

IsometricLayer.prototype.loadLayerData = function()
{
	for(var index in this.data.entities)
 	{
 		this.addEntity(this.data.entities[index]).loadTiles(this.data.entities[index].tiles);
 	}

 	this.update();
};

IsometricLayer.prototype.addEntity = function(entityData)
{
	console.log('se agregó entidad id:', entityData.id);
	var isometricEntity = this.getIsometricEntityByName(entityData.id);

	if(!isometricEntity)
	{
		isometricEntity = new IsometricEntity(entityData);
		this.entityContainer.addChild(isometricEntity);
	}

	return isometricEntity;
};

IsometricLayer.prototype.addTile = function(data)
{ 
	var isometricEntity = this.addEntity(data.entity);

	isometricEntity.addTile(data.tile);
};

IsometricLayer.prototype.getIsometricEntityByName = function(childName)
{
	for(var index in this.entityContainer.children)
	{
		if(this.entityContainer.children[index].name == childName)
		{
			return this.entityContainer.children[index];
		}
	}
};

IsometricLayer.prototype.removeLastTexture = function(data)
{
	var isometricEntity = this.getIsometricEntityByName(data.entity.id);

	if(isometricEntity)
	{
		isometricEntity.removeTexture(isometricEntity.children[isometricEntity.children.length - 1]);
	}
};

IsometricLayer.prototype.updateRenderArea = function()
{
	var margin = 10;
	this.renderArea = new Phaser.Rectangle(margin - this.worldPosition.x, margin - this.worldPosition.y, Game.width - (margin << 1), Game.height - (margin << 1));

	if(this.renderAreaView)
	{
		this.renderAreaView.clear();
	}
	else
	{
		this.renderAreaView = new Phaser.Graphics(Game, 0, 0);
		this.addChild(this.renderAreaView);
	}

	this.renderAreaView.lineStyle(1, 0xFF0000, 0);
	this.renderAreaView.beginFill(0xFF0000, 0);
	this.renderAreaView.drawRect(this.renderArea.x, this.renderArea.y, this.renderArea.width, this.renderArea.height);
	this.renderAreaView.endFill();
};

IsometricLayer.prototype.update = function(entity)
{
	this.updateIsometricPointer();

	this.entityContainer.sort('y', Phaser.Group.SORT_ASCENDING);

	if(Game.toolbar.currentTool == 'default' || Game.toolbar.currentTool == 'paint' || Game.toolbar.currentTool == 'eraser')
	{
		this.showIsometricPointer();
	}
	else
	{
		this.hideIsometricPointer();
	}
	
	if(Game.toolbar.currentTool == 'paint')
	{
		this.showCurrentTexture();
	}
	else
	{
		this.hideCurrentTexture();
	}
};

IsometricLayer.prototype.isEntityOnRenderArea = function(entity)
{
	if(entity.cartesianPosition.x < this.renderArea.x || entity.cartesianPosition.x > (this.renderArea.x + this.renderArea.width)) return false;
	if(entity.cartesianPosition.y < this.renderArea.y || entity.cartesianPosition.y > (this.renderArea.y + this.renderArea.height)) return false;

	return true;
};

IsometricLayer.prototype.updateIsometricPointer = function()
{
	if(Game.device.desktop)
	{
		this.mouseX = Game.input.mousePointer.x - Game.isometricMap.x - this.x;
		this.mouseY = Game.input.mousePointer.y - Game.isometricMap.y - this.y;
	}
	else
	{
		this.mouseX = Game.input.pointer1.x - Game.isometricMap.x - this.x;
		this.mouseY = Game.input.pointer1.y - Game.isometricMap.y - this.y;
	}

	if(!this.isometricPointer)
	{
		this.isometricPointer = new Phaser.Graphics(Game, 0, 0);
		this.isometricPointer.alpha = 0;
		this.isometricPointer.lineStyle(1, 0x000000, .3);
		this.isometricPointer.moveTo((IsometricMapSettings.tileSize >> 1), -(IsometricMapSettings.tileSize >> 2));
		this.isometricPointer.lineTo(IsometricMapSettings.tileSize, 0);
		this.isometricPointer.lineTo((IsometricMapSettings.tileSize >> 1), (IsometricMapSettings.tileSize >> 2));
		this.isometricPointer.lineTo(0, 0);
		this.isometricPointer.lineTo((IsometricMapSettings.tileSize >> 1), -(IsometricMapSettings.tileSize >> 2));
		this.isometricPointer.endFill();
		this.addChild(this.isometricPointer);
	}

	var isometricPoint = IsometricHelpers.cartesianToIsometric(this.mouseX, this.mouseY, IsometricMapSettings.tileSize);
	this.isometricPointer.isoX = isometricPoint.x;
	this.isometricPointer.isoY = isometricPoint.y;
	
	var cartesianPoint = IsometricHelpers.isometricToCartesian(isometricPoint.x, isometricPoint.y, IsometricMapSettings.tileSize);
	this.isometricPointer.x = cartesianPoint.x;
	this.isometricPointer.y = cartesianPoint.y;

	//this.showIsometricPointer();
};

IsometricLayer.prototype.showCurrentTexture = function()
{
	if(this.currentTexture)
	{
		this.currentTexture.x = this.mouseX;
		this.currentTexture.y = this.mouseY;
	}
	else
	{
		this.currentTexture = new Phaser.Sprite(Game, 0, 0, 'Pasto');
		this.currentTexture.alpha = .3;
		this.currentTexture.scale = { x: .3, y: .3}
		
		this.addChild(this.currentTexture);
	}
};

IsometricLayer.prototype.hideCurrentTexture = function()
{
	if(this.currentTexture)
	{
		this.currentTexture.alpha = 0;
	}
};

IsometricLayer.prototype.createGrid = function( rows, columns )
{
	var row, column;
	for(row = 0; row < rows; row++)
	{
		for(column = 0; column < columns; column++)
		{
			this.addIsometricEntity(column, row);
		}
	}
};

IsometricLayer.prototype.activeLayer = function(status)
{
	if(status)
	{
		this.alpha = 1;
		this.activated = true;
		this.showCurrentTexture();
		this.showIsometricPointer();
	}
	else
	{
		this.alpha = .3;
		this.activated = false;
		this.hideCurrentTexture();
		this.hideIsometricPointer();
	}
};

IsometricLayer.prototype.addPivot = function()
{
	if(this.origen)
	{
		this.origen.clear();
	}
	else
	{
		this.origen = new Phaser.Graphics(Game, IsometricMapSettings.tileSize >> 1, 0);
		this.addChild(this.origen);
	}

	this.origen.lineStyle(1, 0xFF0000, .5);
	this.origen.moveTo(-IsometricMapSettings.tileSize >> 1, IsometricMapSettings.tileSize >> 2);
	this.origen.lineTo(IsometricMapSettings.tileSize >> 1, -IsometricMapSettings.tileSize >> 2);
	this.origen.lineStyle(1, 0x00FF00, .5);
	this.origen.moveTo(-IsometricMapSettings.tileSize >> 1, -IsometricMapSettings.tileSize >> 2);
	this.origen.lineTo(IsometricMapSettings.tileSize >> 1, IsometricMapSettings.tileSize >> 2);
	this.origen.lineStyle(1, 0x0000FF, .5);
	this.origen.moveTo(0, 0);
	this.origen.lineTo(0, IsometricMapSettings.tileSize * -1.5);
	this.origen.endFill();
};

IsometricLayer.prototype.showIsometricPointer = function()
{
	if(this.isometricPointer) this.isometricPointer.alpha = 1;
};

IsometricLayer.prototype.hideIsometricPointer = function()
{
	if(this.isometricPointer) this.isometricPointer.alpha = 0;
};

IsometricLayer.prototype.resize = function()
{
	this.updateRenderArea();
};

module.exports = IsometricLayer;