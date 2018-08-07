var EditorManager 		= require('./managers/EditorManager').getInstance();

var Main = function()
{
	if(true)
	{
		EditorManager.addEventListeners();
	}
	else
	{
		this.emprimirMapa();
	}
};

Main.prototype.constructor = Main;

Main.prototype.addUserInterface = function()
{
	
};

Main.prototype.emprimirMapa = function(projectArray)
{
	var x = 0;
	var y = 0;

	var tileWidth = 362;
	var tileHeight = 418;

	function randomIntFromInterval(min,max)
	{
	    return Math.floor(Math.random()*(max-min+1)+min);
	}

	for(var a = 1; a < 30; a++)
	{
		for(var b = 1; b < 14; b++)
		{
			x = b * (tileWidth / 2);
			y = a * (tileHeight / 8);

			if(a % 2)
			{
				x -= (tileWidth / 4);
				//y -= (tileHeight / 8);
			}

			var random = randomIntFromInterval(1,4);

			var entities = ['0', '1','Cesped_1','Cesped_2','Cesped_3','Cesped_4'];

			x -= 200;

			$('<img>', { class: 'rock_0', src: 'images/entities/'+entities[random]+'.png', style: 'display: block; position: absolute; top:'+(y >> 0)+'px; left:'+(x >> 0)+'px; transform: scale(0.5) translate(-100%,-100%);' }).appendTo($('body'));
		}
	}
};


new Main();

