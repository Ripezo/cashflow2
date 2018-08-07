class CashFlowClient {
	
	constructor ()
	{
		console.log('new CashFlowClient();');
		this.socketId = null;
	}

	signIn(userData)
	{
		this.socketId = Server.connect(userData);

		return this.socketId;
	}

	initNewGame ()
	{
		this.playerData = new Player(Server.initNewGame(this.socketId));
		this.displayStatements();
	}

	displayStatements ()
	{
		this.financialStatements = new FinancialStatements(this);
		this.financialStatements.open();
	}
};