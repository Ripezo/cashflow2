var IsometricHelpers =  require('./IsometricHelpers');
var IsometricMapSettings = require('./IsometricMapSettings');

var IsometricPoint = function(cartesianX, cartesianY)
{
	var isoPoint = IsometricHelpers.cartesianToIsometric(cartesianX, cartesianY, IsometricMapSettings.tileSize);
	Phaser.Point.call(this, isoPoint.x, isoPoint.y); // Extends

	var cartPoint = IsometricHelpers.isometricToCartesian(isoPoint.x, isoPoint.y, IsometricMapSettings.tileSize);
	this.cartesianX = cartPoint.x;
	this.cartesianY = cartPoint.y;
}

IsometricPoint.prototype = Object.create(Phaser.Point.prototype);
IsometricPoint.prototype.constructor = IsometricPoint;

module.exports = IsometricPoint;