class CashFlowServer {
	
	constructor ()
	{
		console.log('new CashFlowServer();');
		this.careers = [];
		this.loadCareers();
	}

	connect(userData)
	{
		return 'H3H4G535JGJG435KJ4H5JKH';
	}

	initNewGame (socketId)
	{
		let careerData = this.careers[Utils.getRandomInt(0, this.careers.length - 1)];

		return {
			career: careerData
		};
	}

	loadCareers ()
	{
		$.getJSON('js/data/careers.json', (data) => {
			this.careers = data.careers.careerData;
			console.log('Se cargó un total de ' + this.careers.length + ' profesiones.');
		});
	}
};

