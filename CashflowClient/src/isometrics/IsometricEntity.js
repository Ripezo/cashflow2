var Game = require('./Game');
var CartesianPoint = require('./CartesianPoint');
var IsometricHelpers = require('./IsometricHelpers');
var IsometricMapSettings = require('./IsometricMapSettings');

var IsometricEntity = function(entityData)
{
	this.isometricPosition = { x : entityData.x, y : entityData.y, z : 0 };
	this.cartesianPosition = new CartesianPoint(entityData.x, entityData.y);

	Phaser.Sprite.call(this, Game, this.cartesianPosition.x, this.cartesianPosition.y, 'Piso'); // Extends
	
	this.name = entityData.id;
	this.anchor = { x: 0, y : 0.5};
	this.alpha = .9;
	
	this.z = ((entityData.y + entityData.x) * 1) + ((entityData.y - entityData.x) * 100) + (this.cartesianPosition.y * 10000);

	this.loadTiles(entityData.tiles);
};

IsometricEntity.prototype = Object.create(Phaser.Sprite.prototype);
IsometricEntity.prototype.constructor = IsometricEntity;

IsometricEntity.prototype.loadTiles = function(tileArray)
{
	this.removeChildren();

	for(var index in tileArray)
	{
		this.addTile(tileArray[index]);
	}
};

IsometricEntity.prototype.addTile = function(data)
{
	this.alpha = 1;

	if(!this.tiles)
	{
		this.loadTexture(null);
		this.tiles = [];
	}
	
	if(data)
	{
		console.log(data);

		this.tiles.push(data);
		var image = new Phaser.Image(Game, 0, 0);
		image.src = data.src;
		//var image = new Phaser.Image(Game, IsometricMapSettings.tileSize >> 1, 0, 'Pasto');
		image.isoHeight = data.height;
		this.addChild(image);

		image.anchor = {x : IsometricHelpers.norm(150, 0, image.width), y : IsometricHelpers.norm(100, 0, image.height)};

		if(this.children.length > 1)
		{
			image.y = this.children[this.children.length - 2].y - this.children[this.children.length - 1].isoHeight;

		}
	}
};

IsometricEntity.prototype.removeTexture = function(textureInstance)
{
	if(textureInstance)
	{
		this.removeChild(textureInstance);
		textureInstance.destroy();
	}
};

module.exports = IsometricEntity;