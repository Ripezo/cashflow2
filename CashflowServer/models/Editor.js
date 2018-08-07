var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var Editor = new Schema({
	nickname : { type : String, require : true },
	email : { type : String, require : true },
	token : { type : String, require : true },
	socketId : { type : String, require : true }
});

module.exports = Mongoose.model('Editor', Editor);