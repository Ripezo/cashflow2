var instance;

var Settings = function()
{
	if(false)
	{
		this.hostName = 'http://ripezo.com';
		this.staticServer = 'http://ripezo.com/static';
	}
	else
	{
		this.hostName = 'http://localhost:10205';
		this.staticServer = 'http://localhost:10205/static';
	}

	this.inactivityTime = 1000*60*60; // Milliseconds.
};

exports.getInstance = function()
{
	if(!instance) instance = new Settings();
	return instance;
};