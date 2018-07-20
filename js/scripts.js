$(function() {
	var dado1 = new Dice();
		dado1.appendTo($('#cashflow'));

	var comenzar = $('<button>', {
		class: 'boton comenzar',
		html: 'Comenzar'
	}).on('click', (event) => {
		
		Client.initNewGame();

		$(event.currentTarget).fadeOut(300);
	});

	window.Server = new CashFlowServer();
	window.Client = new CashFlowClient();

	if(Client.signIn({
		user: 'Ripezo@gmail.com',
		pass: 'ClaveDifícil'
	})) {
		comenzar.appendTo($('#cashflow'));
	}
	else
	{
		console.log('Login Incorrecto.');
	}

});