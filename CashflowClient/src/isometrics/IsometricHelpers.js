module.exports = {
	randomRange : function (minNum, maxNum) 
	{
		return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
	},

	lerp : function(value, min, max){
		return (max - min) * value + min;
	},
	
	norm : function(value, min, max){
		return (value - min) / (max - min);
	},

	isometricToCartesian : function(isoX, isoY, entitySize)
	{
		var cartX = ((isoX + isoY) * (entitySize >> 1)) >> 0;
		var cartY = ((isoY - isoX) * (entitySize >> 2)) >> 0;
	    return { x : cartX, y : cartY };
	},

	cartesianToIsometric : function(cartX, cartY, entitySize)
	{
		var isoX = (cartX - (cartY << 1)) / entitySize;
		var isoY = (cartX + (cartY << 1)) / entitySize;
		return { x : Math.floor(isoX), y : Math.floor(isoY) };
	},

	getEntityName : function(isoPosX, isoPosY)
	{
		return String(isoPosX + 'x' + isoPosY);
	}
}