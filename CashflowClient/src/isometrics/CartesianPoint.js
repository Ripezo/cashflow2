var IsometricHelpers =  require('./IsometricHelpers');
var IsometricMapSettings = require('./IsometricMapSettings');

var CartesianPoint = function(isoX, isoY)
{
	var cartPoint = IsometricHelpers.isometricToCartesian(isoX, isoY, IsometricMapSettings.tileSize);
	Phaser.Point.call(this, cartPoint.x, cartPoint.y); // Extends

	var isoPoint = IsometricHelpers.cartesianToIsometric(cartPoint.x, cartPoint.y, IsometricMapSettings.tileSize);
	this.isometricX = isoPoint.x;
	this.isometricY = isoPoint.y;
}

CartesianPoint.prototype = Object.create(Phaser.Point.prototype);
CartesianPoint.prototype.constructor = CartesianPoint;

module.exports = CartesianPoint;