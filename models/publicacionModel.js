var mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');
var Schema   = mongoose.Schema;

var publicacionSchema = new Schema({
	'imagen' : String,
	'imagen_public_id' : String,
	'imagen_url': String, 
	'likes' : Number,
	'descripcion': String,
	'usuarioID': {
		type: Schema.Types.ObjectId,
		ref: 'usuarios'
	}
},
{
	timestamps: true,
	versionKey: false
});

module.exports = mongoose.model('publicaciones', publicacionSchema);
