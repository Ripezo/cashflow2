class FinancialStatements
{
	constructor (cashFlowClient)
	{
		this.cashFlowClient = cashFlowClient;
		this.addEventListeners();
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
		this.update();
		$('#statements').addClass('open');
		TweenMax.to($('#statements'), .3, { left: 0, ease: Linear.easeNone });
	}

	close ()
	{
		$('#statements').removeClass('open');
		TweenMax.to($('#statements'), .3, { left: '-100%', ease: Linear.easeNone });
	}

	update ()
	{
		let careerData = this.cashFlowClient.playerData.careerData;
		let children = this.cashFlowClient.playerData.children;
		let childPerExpense = children * careerData.childPerExpense;
		let interestDividens = this.cashFlowClient.playerData.interestDividens;

		$('#statements .career .name').html(careerData.title);
		$('#statements .career .salary').html(Utils.currencyNormalize(careerData.salary));
		$('#statements .tax-value .value').html(Utils.currencyNormalize(careerData.taxes));
		$('#statements .mortgage-payment .value').html(Utils.currencyNormalize(careerData.mortgagePayment));
		$('#statements .schoolloan-payment .value').html(Utils.currencyNormalize(careerData.schoolLoanPayment));

		if(careerData.schoolLoanPayment) {
			$('#statements .schoolloan-payment').show();
		} else {
			$('#statements .schoolloan-payment').hide();
		}

		$('#statements .carloan-payment .value').html(Utils.currencyNormalize(careerData.carLoanPayment));
		$('#statements .creditcard-payment .value').html(Utils.currencyNormalize(careerData.creditCardPayment));
		$('#statements .retail-payment .value').html(Utils.currencyNormalize(careerData.retailPayment));
		$('#statements .other-expenses .value').html(Utils.currencyNormalize(careerData.otherExpenses));
		$('#statements .child-expenses .value').html(Utils.currencyNormalize(childPerExpense));

		if(children) {
			$('#statements .child-expenses').show();
		} else {
			$('#statements .child-expenses').hide();
		}

		$('#statements .savings .value').html(Utils.currencyNormalize(careerData.savings));

		let totalIncome = careerData.salary;
			$.each(interestDividens, (indice, monto) => {
				totalIncome += monto;
			});
		$('#statements .total-income .value').html(Utils.currencyNormalize(totalIncome));

		let totalExpenses = careerData.taxes + careerData.mortgagePayment + careerData.carLoanPayment + careerData.creditCardPayment + careerData.retailPayment + careerData.otherExpenses + childPerExpense;
			$.each(interestDividens, (indice, monto) => {
				totalExpenses += monto;
			});
		$('#statements .total-expenses .value').html(Utils.currencyNormalize(totalExpenses));

		$('#statements .payday .value').html(Utils.currencyNormalize(totalIncome - totalExpenses));

		$('#statements .mortgage-liability .value').html(Utils.currencyNormalize(careerData.mortgageLiability));
		$('#statements .school-loan-liability .value').html(Utils.currencyNormalize(careerData.schoolLoanLiability));

		if(careerData.schoolLoanLiability) {
			$('#statements .school-loan-liability').show();
		} else {
			$('#statements .school-loan-liability').hide();
		}

		$('#statements .car-loan-liability .value').html(Utils.currencyNormalize(careerData.carLoanLiability));
		$('#statements .credit-loan-liability .value').html(Utils.currencyNormalize(careerData.creditCardLiability));
		$('#statements .retail-liability .value').html(Utils.currencyNormalize(careerData.retailDebtLiability));
		$('#statements .retail-liability .value').html(Utils.currencyNormalize(careerData.retailDebtLiability));
	}
}