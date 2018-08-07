var Modal = function(id, title, placeholder, buttonText, callbackFunction)
{
	this.id = id;
	this.title = title;
	this.placeholder = placeholder;
	this.buttonText = buttonText;
	this.callbackFunction = callbackFunction;
	this.addDOMElements();
};

Modal.prototype.constructor = Modal;

Modal.prototype.addDOMElements = function()
{
	this.modal = $('<div>', { id: this.id, class: 'modal fade', role: 'dialog' });
	this.modal.appendTo($('body'));

	this.modalDialog = $('<div>', { class: 'modal-dialog' });
	this.modalDialog.appendTo(this.modal);

	this.modalContent = $('<div>', { class: 'modal-content' });
	this.modalContent.appendTo(this.modalDialog);

	this.modalHeader = $('<div>', { class: 'modal-header', html: '<button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">'+this.title+'</h4>' });
	this.modalHeader.appendTo(this.modalContent);

	this.modalBody = $('<div>', { class: 'modal-body' });
	this.modalBody.appendTo(this.modalContent);

	this.nameInput = $('<input>', { name: 'project_name', type: 'text', placeholder: this.placeholder, style: 'border: 1px solid #cccccc; border-radius: 5px;    padding: 10px; width: 50%;' });
	this.nameInput.appendTo(this.modalBody);

	this.modalFooter = $('<div>', { class: 'modal-footer' });
	this.modalFooter.appendTo(this.modalContent);

	this.dismiss = $('<button>', { type: 'button', class: 'btn btn-default', 'data-dismiss': 'modal', html: 'Cancelar' });
	this.dismiss.appendTo(this.modalFooter);

	this.action = $('<button>', { type: 'submit', class: 'btn btn-primary', 'data-dismiss': 'modal', html: this.buttonText });
	this.action.appendTo(this.modalFooter);

	this.action.on('click', function(event)
	{
		event.preventDefault();
		if(this.callbackFunction) this.callbackFunction(this.nameInput.val());
	}.bind(this));
};

module.exports = Modal;