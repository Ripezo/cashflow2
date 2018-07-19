var Utils = function()
{
	console.log('new Utils();');
};

Utils.prototype.constructor = Utils;

Utils.prototype.lerp = function(start, end, amt) {
	return start + ( end - start ) * amt;
};

Utils.prototype.norm = function(value, start, end) {
	return ( value - start ) / ( end - start );
};

Utils.prototype.getDistance = function(x1, y1, x2, y2) {
	let deltaX = (x2 - x1) * (x2 - x1);
	let deltaY = (y2 - y1) * (y2 - y1);
	return Math.sqrt(deltaX + deltaY);
};

/**
 * Get a random floating point number between `min` and `max`.
 * 
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {number} a random floating point number
 */
Utils.prototype.getRandomFloat = function(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Get a random integer between `min` and `max`.
 * 
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {number} a random integer
 */
Utils.prototype.getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Get a random boolean value.
 * 
 * @return {boolean} a random true/false
 */
Utils.prototype.getRandomBool = function () {
  return Math.random() >= 0.5;
};

/*
 * Get a random boolean value.
 * 
 * @return {boolean} a random true/false
 */
Utils.prototype.currencyNormalize = function (value) {
	value = parseInt(value) * 650;
 	return (value).toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$&.').slice(0, -2);
};

window.Utils = new Utils();