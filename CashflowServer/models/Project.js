var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var Project = new Schema({
	name : { type : String, require : true },
	author : { type : Schema.Types.ObjectId, require : true },
	created : { type : Date, require : true },
	lastSave : { type : Date, require : true },
	contributors : { type : [Schema.Types.ObjectId], require : false },
	entities : { type : [Schema.Types.Mixed], require : false },
	filesPath : { type : String, require : false }
});

module.exports = Mongoose.model('Project', Project);