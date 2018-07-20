 class FinancialStatements
{
	constructor (cashFlowClient)
	{
		this.cashFlowClient = cashFlowClient;
		this.playerData = cashFlowClient.playerData;
		this.setup();
		this.addEventListeners();
	}

	setup()
	{
		this.$statements = $('<div>', {
			id: 'statements'
		}).appendTo($('#cashflow'));

		this.$container = $('<div>', {
			class: 'container unselectable'
		}).appendTo(this.$statements);

		// Income
		this.$income = $('<div>', {
			id: 'income',
			class: 'section',
			html: '<h2 class="title">Ingresos Mensuales</h2>'
		}).appendTo(this.$container);

		this.$incomeDetails = $('<table>', {
			id: 'income-details',
			border: 0,
			cellpadding: 0,
			cellspacing: 0,
			css: { width: '100%', borderCollapse: 'collapse' },
			html: '<tr><th>Detalle</th><th>Cantidad</th></tr>'
		}).appendTo(this.$income);

		this.$ratRace = $('<div>', {
			id: 'rat-race',
			class: 'section',
			html: '<p class="objetivo">Incrementa la cantidad de ingresos<br>para salir del camino de la rata</p><h2 class="expenses-stack">Gasto Total: $<span class="amount">[gasto_total]</span></h2>'
		}).appendTo(this.$container);

		this.$progressBar = $('<div>', {
			id: 'progress-bar',
			class: 'barra',
			html: '<div class="fill"><div class="income-stack">Ingreso Total<br>$<strong class="amount">[ingreso_total]</strong></div></div>'
		}).appendTo(this.$ratRace);

		// Expenses
		this.$expenses = $('<div>', {
			id: 'expenses',
			class: 'section',
			html: '<h2 class="title">Gastos Mensuales</h2>'
		}).appendTo(this.$container);

		this.$paymentDetails = $('<table>', {
			id: 'payment-details',
			border: 0,
			cellpadding: 0,
			cellspacing: 0,
			css: { width: '100%', borderCollapse: 'collapse' },
			html: '<tr><th>Detalle</th><th>Cantidad</th></tr>'
		}).appendTo(this.$expenses);

		this.$balance = $('<div>', {
			id: 'balance',
			class: 'section',
			html: '<table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;"></table>'
		}).appendTo(this.$container);

			this.$savings = $('<tr>', {
				id: 'savings',
				html: '<th>Saldo en Cuenta Bancaria:</th><th>$<span class="amount">[cantidad]</span></th></tr>'
			}).appendTo(this.$balance.find('> table'));

			this.$totalIncome = $('<tr>', {
				class: 'total-income',
				html: '<td>Ingreso total:</td><td>$<span class="amount">[cantidad]</span></td></tr>'
			}).appendTo(this.$balance.find('> table'));

			this.$totalExpenses = $('<tr>', {
				class: 'total-expenses',
				html: '<td>Gasto total:</td><td>$<span class="amount">[cantidad]</span></td></tr>'
			}).appendTo(this.$balance.find('> table'));

			this.$payDay = $('<tr>', {
				id: 'payday',
				html: '<td>Ingreso Mensual:</td><td>$<span class="amount">[cantidad]</span></td></tr>'
			}).appendTo(this.$balance.find('> table'));

		// Assets
		this.$assets = $('<div>', {
			id: 'assets',
			class: 'section',
			html: '<h2 class="title">Bienes</h2>'
		}).appendTo(this.$container);

		this.$businessDetails = $('<table>', {
			id: 'business-details',
			border: 0,
			cellpadding: 0,
			cellspacing: 0,
			css: { width: '100%', borderCollapse: 'collapse' },
			html: '<tr><th>Detalle</th><th>Cantidad</th></tr>'
		}).appendTo(this.$assets);

		// Liabilities
		this.$liabilities = $('<div>', {
			id: 'liabilities',
			class: 'section',
			html: '<h2 class="title">Compromisos Financieros</h2>'
		}).appendTo(this.$container);

		this.$loanDetails = $('<table>', {
			id: 'loan-details',
			border: 0,
			cellpadding: 0,
			cellspacing: 0,
			css: { width: '100%', borderCollapse: 'collapse' },
			html: '<tr><th>Créditos</th><th>Cantidad</th></tr>'
		}).appendTo(this.$liabilities);

		this.updateBalance();
	}

	updateCash (amount)
	{
		this.$savings.find('.amount').html(Utils.currencyNormalize(amount));
		return amount;
	}

	updateTotalIncome (amount)
	{
		// Passive Income
		let passiveIncome = amount - this.playerData.careerData.salary;
		this.$progressBar.find('.amount').html(Utils.currencyNormalize(passiveIncome));
		this.$progressBar.find('.fill').css({ width: Utils.lerp(0, 100, Utils.norm(passiveIncome, 0, this.calculateTotalExpenses())) + '%' });

		this.$totalIncome.find('.amount').html(Utils.currencyNormalize(amount));
		return amount;
	}

	updateTotalExpenses (amount)
	{
		$('.expenses-stack .amount').html(Utils.currencyNormalize(amount));
		this.$totalExpenses.find('.amount').html(Utils.currencyNormalize(amount));
		return amount;
	}

	updatePayDay (amount)
	{
		this.$payDay.find('.amount').html(Utils.currencyNormalize(amount));
	}

	addIncome (uid, name , amount, multiplier = 1)
	{
		if(parseInt(amount) && parseInt(multiplier))
		{
			$('.income[data-uid="' + uid + '"]').remove();
			this.$income.find('> table').append($('<tr>', { class: 'income', 'data-uid': uid, html: '<td>' + name + '</td><td>$<span class="amount">' + Utils.currencyNormalize(parseInt(amount) * parseInt(multiplier)) + '</span></td>' }));
		}

		return amount * multiplier;
	}

	addPayment (id, name, amount, multiplier = 1)
	{
		if(parseInt(amount) && parseInt(multiplier))
		{
			$('#' + id).remove();
			this.$paymentDetails.append($('<tr>', { id: id, html: '<td>' + name + '</td><td>$<span class="amount">' + Utils.currencyNormalize(parseInt(amount) * parseInt(multiplier)) + '</span></td>' }));
		}

		return amount * multiplier;
	}

	addBusiness (uid, name, amount, multiplier = 1)
	{
		if(parseInt(amount) && parseInt(multiplier))
		{
			this.$businessDetails.append($('<tr>', { 'data-uid': uid, html: '<td>' + name + '</td><td>$<span class="amount">' + Utils.currencyNormalize(parseInt(amount) * parseInt(multiplier)) + '</span></td>' }));
		}
	}

	addLiability (id, name, amount, multiplier = 1)
	{
		if(parseInt(amount) && parseInt(multiplier))
		{
			let row = $('<tr>', { class: 'liability', html: '<td>' + name + '</td><td>$<span class="amount">' + Utils.currencyNormalize(parseInt(amount) * parseInt(multiplier)) + '</span></td>' });

			this.$loanDetails.append(row);
			
			let input = $('<input>', {
				name: id,
				type: 'checkbox'
			}).on('click', function(event) {
				let nameValue = $(event.currentTarget).attr('name');
				$('#payment-details #' + nameValue).toggleClass('selected');
			}.bind(this));

			input.prependTo(row.find('td').eq(0));
		}
	}

	repayLiability()
	{
		this.$loanDetails.find('.liability input[type="checkbox"]').fadeIn(300);
	}

	addEventListeners () {
		let _this = this;

		$('#statements').on('click', (event) => {
			if($(event.target).attr('id') == 'statements')
			{
				if($('#statements').hasClass('open')) 
				{
					_this.close();
				}
				else
				{
					_this.open();
				}
			}
		});

		$('#statements').css({ visibility: 'visible' });
	}

	open ()
	{
		
		$('#statements').addClass('open');
		TweenMax.to($('#statements'), .3, { left: 0, ease: Linear.easeNone });
	}

	close ()
	{
		$('#statements').removeClass('open');
		TweenMax.to($('#statements'), .3, { left: '-100%', ease: Linear.easeNone });
	}

	calculateTotalIncome()
	{
		let totalIncome = this.playerData.careerData.salary;

		return totalIncome;
	}

	calculateTotalExpenses()
	{
		let totalExpenses = this.addPayment('taxes', 'Impuestos', this.playerData.careerData.taxes);

		this.$loanDetails.find('.liability').remove();

		$.each(this.playerData.liabilities, (indice, liability) => {
			totalExpenses += this.addPayment('liability-' + indice, liability.name, liability.payment);
			this.addLiability('liability-' + indice, liability.name, liability.loan);
		});

		totalExpenses += this.addPayment('other-expenses', 'Otros Gastos', this.playerData.careerData.otherExpenses);
		totalExpenses += this.addPayment('child-per-expense', 'Gastos por hijos', this.playerData.careerData.childPerExpense, this.playerData.children);

		return totalExpenses;
	}

	updateBalance ()
	{
		this.addBusiness('business-0', 'Departamento 2 Dormitorios y 2 Baños', 55000);

		this.addIncome('salary', 'Sueldo de ' + this.playerData.careerData.title, this.playerData.careerData.salary);
		this.updateCash(this.playerData.careerData.savings);
		this.updatePayDay(this.updateTotalIncome(this.calculateTotalIncome()) - this.updateTotalExpenses(this.calculateTotalExpenses()));
	}
}