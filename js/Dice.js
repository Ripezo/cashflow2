var Dice = function()
{

};

Dice.prototype.constructor = Dice;

Dice.prototype.lanzar = function()
{
	var launchValue = Utils.getRandomInt(1, 6);
	console.log(launchValue, (Utils.norm(launchValue, 1, 6) * 100) + '%');
	this.$dice.attr('data-content', launchValue.toString());
	return launchValue; 
};

Dice.prototype.appendTo = function($container)
{
	this.$dice = $('<button>', { class: 'dice', 'data-content': 0 });
	this.$dice.on('click', function(event) {
		event.preventDefault();
		this.lanzar();
	}.bind(this));

	this.$dice.appendTo($container);
};