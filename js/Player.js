class Player
{
	constructor (careerData)
	{
		this.name = '';
		this.careerData = careerData.career;
		this.children = 0;
		this.interestDividens = [];
		this.liabilities = [];

		console.log(careerData.career);

		this.liabilities.push({
			name: 'Crédito Hipotecario',
			loan: this.careerData.mortgageLiability,
			payment: this.careerData.mortgagePayment
		});

		this.liabilities.push({
			name: 'Crédito Universitario',
			loan: this.careerData.schoolLoanLiability,
			payment: this.careerData.schoolLoanPayment
		});

		this.liabilities.push({
			name: 'Crédito Automotriz',
			loan: this.careerData.carLoanLiability,
			payment: this.careerData.carLoanPayment
		});

		this.liabilities.push({
			name: 'Tarjetas de Crédito',
			loan: this.careerData.creditCardLiability,
			payment: this.careerData.creditCardPayment
		});

		this.liabilities.push({
			name: 'Tarjetas Comerciales',
			loan: this.careerData.retailDebtLiability,
			payment: this.careerData.retailPayment
		});
	}
};