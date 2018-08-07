var md5 = require('md5-js');
var instance;

var LoginForm = function()
{

};

LoginForm.prototype.constructor = LoginForm;

LoginForm.prototype.addDOMElements = function()
{
	this.form = $('<form />', { id: 'loginForm', class: 'form-signin' });
	//this.form.nicknameLabel = $('<label for="inputName" class="sr-only">Nombre</label>').appendTo(this.form);
	//this.form.nickname = $('<input type="text" id="inputName" class="form-control" placeholder="Nombre">').appendTo(this.form);
	this.form.emailLabel = $('<label for="inputEmail" class="sr-only">Correo</label>').appendTo(this.form);
	this.form.email = $('<input type="email" id="inputEmail" class="form-control" placeholder="Correo" required autofocus style="margin-bottom: -1px;border-bottom-right-radius: 0;border-bottom-left-radius: 0;">').appendTo(this.form);
	this.form.passwordLabel = $('<label for="inputPassword" class="sr-only">Clave</label>').appendTo(this.form);
	this.form.password = $('<input type="password" id="inputPassword" class="form-control" placeholder="Clave" required style="border-top-right-radius: 0;border-top-left-radius: 0;">').appendTo(this.form);
	//this.form.rePasswordLabel = $('<label for="inputRePassword" class="sr-only">Confirmar clave</label>').appendTo(this.form);
	//this.form.rePassword = $('<input type="password" id="inputRePassword" class="form-control" placeholder="Confirmar clave" required>').appendTo(this.form);
	this.form.remember = $('<div class="checkbox"><label><input type="checkbox" value="remember-me"> Remember me</label></div>').appendTo(this.form);
	this.form.loginButton = $('<button class="btn btn-lg btn-primary btn-block" type="submit">Ingresar</button>').appendTo(this.form);
	//this.form.loginMenu.showRegisterButton = $('<a id="showRegister">Register</a>').appendTo(this.form.loginMenu);
	$('body').append(this.form);

	//$(this.form).submit(this.submit.bind(this));
};

LoginForm.prototype.submit = function()
{
	event.preventDefault();

	this.nickname = $(this.form.nickname).val();
	this.email = $(this.form.email).val();
	this.password = $(this.form.password).val();
	this.rePassword = $(this.form.rePassword).val();
	this.MD5Password = md5(this.password);
	this.token = md5(this.password + this.MD5Password);

	if($('#loginMenu .selected').attr('id') == 'showRegister' && this.nickname.length < 2)
	{
		console.log('Invalid Nickname.');
	}
	else if(!this.validateEmail(this.email))
	{
		console.log('Invalid E-mail.');
	}
	else if(this.password === '')
	{
		console.log('Invalid Password.');
	}
	else if($('#loginMenu .selected').attr('id') == 'showRegister' && this.password != this.rePassword)
	{
		console.log('Password is not equal.');
	}
	else
	{
		if(callbackFunction) callbackFunction();
	}
};

LoginForm.prototype.validateEmail = function(email)
{
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
};

LoginForm.prototype.show = function()
{
	if(!this.form) this.addDOMElements();

	this.form.show();
};

LoginForm.prototype.hide = function()
{
	this.form.hide();
};

LoginForm.prototype.is = function(value)
{
	return this.form.is(value);
};

exports.getInstance = function()
{
	if(!instance) instance = new LoginForm();
	return instance;
};