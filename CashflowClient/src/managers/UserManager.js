var instance;
var SocketManager 	= require('./SocketManager').getInstance();
var ProjectManager 	= require('./ProjectManager').getInstance();
var MD5 			= require('md5-js');

var UserManager = function()
{
	this.rememberUser = false;	
};

UserManager.prototype.addEventListeners = function()
{
	SocketManager.on('whois', this.onWhoIsHandler.bind(this));
	SocketManager.on('login', this.onLoginHandler.bind(this));
	SocketManager.on('register', this.onRegisterHandler.bind(this));
};

UserManager.prototype.onWhoIsHandler = function(data)
{
	console.log('onWhoIsHandler();');
	if(document.cookie)
	{
		var cookieValues = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1").split(':');
		SocketManager.emit('login', { email : cookieValues[0], token : cookieValues[1] });
	}
	else
	{
		this.addLoginForm();
	}
};

UserManager.prototype.addLoginForm = function()
{
	if(this.form) this.form.remove();
	this.form = $('<form />', { id: 'login-form' });
	this.form.emailLabel = $('<label for="inputEmail" class="sr-only">Correo</label>').appendTo(this.form);
	this.form.email = $('<input type="email" id="inputEmail" class="form-control" placeholder="Correo" required autofocus style="margin-bottom: -1px;border-bottom-right-radius: 0;border-bottom-left-radius: 0;">').appendTo(this.form);
	this.form.passwordLabel = $('<label for="inputPassword" class="sr-only">Contraseña</label>').appendTo(this.form);
	this.form.password = $('<input type="password" id="inputPassword" class="form-control" placeholder="Contraseña" required style="border-top-right-radius: 0;border-top-left-radius: 0;">').appendTo(this.form);
	this.form.remember = $('<div class="checkbox"><label><input id="remember" type="checkbox" value="remember-me"> Remember me</label></div>').appendTo(this.form);
	this.form.loginButton = $('<button class="btn btn-lg btn-primary btn-block" type="submit">Ingresar</button>').appendTo(this.form);
	this.form.registerButton = $('<a id="showRegister" class="no-registered">¿Aún no estás registrado?</a>').appendTo(this.form);
	$('#login').append(this.form);

	this.form.registerButton.on('click', function(event)
	{
		event.preventDefault();
		this.addRegisterForm();
	}.bind(this));

	this.form.submit(function(event)
	{
		event.preventDefault();

		var correo 			= this.form.email.val();
		var clave 			= this.form.password.val();
		var token 			= MD5(correo + clave);

		this.rememberUser = $('#remember').is(':checked');

		SocketManager.emit('login',
		{
			email : correo,
			token : token
		});
	}.bind(this));

	this.form.fadeIn(300);
};

UserManager.prototype.addRegisterForm = function()
{
	if(this.form) this.form.remove();
	this.form = $('<form />', { id: 'register-form' });
	this.form.nicknameLabel = $('<label for="inputName" class="sr-only">Nombre</label>').appendTo(this.form);
	this.form.nickname = $('<input type="text" id="inputName" class="form-control" placeholder="Nombre">').appendTo(this.form);
	this.form.emailLabel = $('<label for="inputEmail" class="sr-only">Correo</label>').appendTo(this.form);
	this.form.email = $('<input type="email" id="inputEmail" class="form-control" placeholder="Correo" required autocomplete="off" autofocus style="margin-bottom: -1px;border-bottom-right-radius: 0;border-bottom-left-radius: 0;">').appendTo(this.form);
	this.form.passwordLabel = $('<label for="inputPassword" class="sr-only">Contraseña</label>').appendTo(this.form);
	this.form.password = $('<input type="password" id="inputPassword" class="form-control" placeholder="Contraseña" required autocomplete="off" style="border-top-right-radius: 0;border-top-left-radius: 0;">').appendTo(this.form);
	this.form.rePasswordLabel = $('<label for="inputRePassword" class="sr-only">Confirmar clave</label>').appendTo(this.form);
	this.form.rePassword = $('<input type="password" id="inputRePassword" class="form-control" placeholder="Confirmar clave" required>').appendTo(this.form);
	this.form.remember = $('<div class="checkbox"><label><input id="remember" type="checkbox" value="remember-me"> Remember me</label></div>').appendTo(this.form);
	this.form.loginButton = $('<button class="btn btn-lg btn-primary btn-block" type="submit">Registrar</button>').appendTo(this.form);
	this.form.registerButton = $('<a id="showRegister" class="registered">¿Ya estás registrado?</a>').appendTo(this.form);
	$('#login').append(this.form);

	this.form.registerButton.on('click', function(event)
	{
		event.preventDefault();
		this.addLoginForm();
	}.bind(this));

	this.form.submit(function(event)
	{
		event.preventDefault();

		$('.alert').fadeOut(300, function()
		{
			$(this).remove();
		});

		var nickname 		= this.form.nickname.val();
		var correo 			= this.form.email.val();
		var clave 			= this.form.password.val();
		var confirm 		= this.form.rePassword.val();
		var token 			= MD5(correo + clave);

		if(nickname.length < 2)
		{
			this.form.before($('<div class="alert alert-danger fade in alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a><strong>Importante!</strong> El nombre no puede ser tan corto.</div>'));
			this.form.nickname.val('').focus();
		}
		else if(!this.validateEmail(correo))
		{
			this.form.before($('<div class="alert alert-danger fade in alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a><strong>Importante!</strong> Debes usar un correo válido.</div>'));
			this.form.email.val('').focus();
		}
		else if(clave != confirm)
		{
			this.form.before($('<div class="alert alert-danger fade in alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a><strong>Importante!</strong> Las contraseñas deben ser iguales.</div>'));
			this.form.password.val('').focus();
			this.form.rePassword.val('');
		}
		else
		{
			this.rememberUser = $('#remember').is(':checked');

			SocketManager.emit('register', {
				nickname : nickname,
				email : correo,
				token : token
			});
		}
		
	}.bind(this));

	this.form.fadeIn(300);
};

UserManager.prototype.onLoginHandler = function(data)
{
	console.log('onLoginHandler();');
	if(data.success)
	{
		if(this.rememberUser) document.cookie = "token=" + data.success;

		if(this.form)
		{
			this.form.fadeOut(300, function()
			{
				this.form.remove();
			}.bind(this));
		}

		ProjectManager.addUserInterface();
	}
	else
	{
		document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		$('.register').remove();
		var error = $('<div>', { class: 'alert alert-danger fade in alert-dismissable register' });
    		error.append($('<a>', { class: 'close', 'data-dismiss': 'alert', 'aria-label': 'close', title: 'close', html: 'x' }));
    		error.append($('<strong>', { html: 'Error. ' }));
    		error.append(data.error);
    		error.appendTo($('#alerts'));
	}
};

UserManager.prototype.onRegisterHandler = function(data)
{
	//console.log('onRegisterHandler();');
	if(data.success)
	{
		if(this.rememberUser)
		{
			document.cookie = "token=" + data.success;

			if(this.form)
			{
				this.form.fadeOut(300, function()
				{
					this.form.remove();
				}.bind(this));
			}

			ProjectManager.addUserInterface();
		}

		var success = $('<div>', { class: 'alert alert-success fade in alert-dismissable' });
    		success.append($('<a>', { class: 'close', 'data-dismiss': 'alert', 'aria-label': 'close', title: 'close', html: 'x' }));
    		success.append($('<strong>', { html: 'Bienvenido!' }));
    		success.append(' Ya estás registrado.');
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
	else
	{
		$('.register').remove();
		var error = $('<div>', { class: 'alert alert-danger fade in alert-dismissable register' });
    		error.append($('<a>', { class: 'close', 'data-dismiss': 'alert', 'aria-label': 'close', title: 'close', html: 'x' }));
    		error.append($('<strong>', { html: 'Error. ' }));
    		error.append(data.error);
    		error.appendTo($('#alerts'));
	}
};

UserManager.prototype.validateEmail = function(email)
{
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
};

exports.getInstance = function()
{
	if(!instance) instance = new UserManager();
	return instance;
};