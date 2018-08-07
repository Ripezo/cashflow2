var io 			= require('socket.io-client');
var Settings 	= require('../Settings').getInstance();
var instance;

var SocketManager = function()
{
	this.io = io(Settings.hostName + '/socket', { 'transports': ['polling']});
	this.io.on('connect', function(event)
	{
	    if($('.connect_error').length || $('.disconnect').length)
	    {
	    	$('.connect_error').remove();
	    	$('.disconnect').remove();

	    	var success = $('<div>', { class: 'alert alert-success fade in alert-dismissable' });
	    		success.append($('<a>', { class: 'close', 'data-dismiss': 'alert', 'aria-label': 'close', title: 'close', html: 'x' }));
	    		success.append($('<strong>', { html: 'Conectado.' }));
	    		success.append(' Se ha establecido una conexion con el servidor.');
	    		success.appendTo($('#alerts'));

	    		setTimeout(function()
	    		{
	    			success.hide(300, function()
	    			{
	    				$(this).remove();
	    			});
	    		},
	    		5000);
		}
	});

	this.io.on('disconnect', function()
	{
	    $('.disconnect').remove();
		var error = $('<div>', { class: 'alert alert-danger fade in alert-dismissable disconnect' });
    		error.append($('<a>', { class: 'close', 'data-dismiss': 'alert', 'aria-label': 'close', title: 'close', html: 'x' }));
    		error.append($('<strong>', { html: 'Desconectado.' }));
    		error.append(' Se ha perdido la conexion con el servidor.');
    		error.appendTo($('#alerts'));

    		setTimeout(function()
    		{
    			error.hide(300, function()
    			{
    				$(this).remove();
    			});
    		},
    		5000);
	});

	this.io.on('connect_failed', function()
	{
	    console.log("Error. on connect_failed");
	});

	this.io.on('connect_error', function()
	{
		$('.connect_error').remove();
		var error = $('<div>', { class: 'alert alert-danger fade in alert-dismissable connect_error' });
    		error.append($('<a>', { class: 'close', 'data-dismiss': 'alert', 'aria-label': 'close', title: 'close', html: 'x' }));
    		error.append($('<strong>', { html: 'Error.' }));
    		error.append(' No es posible establecer una conexion con el servidor.');
    		error.appendTo($('#alerts'));
	});

	return this.io;
};

exports.getInstance = function()
{
	if(!instance) instance = new SocketManager();
	return instance;
};