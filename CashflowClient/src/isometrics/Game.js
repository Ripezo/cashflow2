var instance;

exports.getInstance = function()
{
	if(!instance) instance = new Phaser.Game('100%', '100%', Phaser.AUTO, 'canvas-container', null, true);
	return instance;
};