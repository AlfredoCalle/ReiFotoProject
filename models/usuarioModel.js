var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
const bcrypt = require('bcryptjs');

var usuarioSchema = new Schema({
	'nombre' : String,
	'usuario': String,
	'email' : String,
	'contrasena' : String,
	'genero': String,
	'fotoperfil': String,
	'fotoperfil_public_id' : String,
	'fotoperfil_url': String, 
	'descripcion': String,
	'cantidadPublicaciones': Number,
	'cantidadSeguidores': Number,
	'cantidadSeguidos': Number
},
{
	timestamps: true,
	versionKey: false
});

usuarioSchema.methods.encryptPassword = async (contrasena) => {
	const saltos = await bcrypt.genSalt(10);
	return bcrypt.hash(contrasena, saltos);
}

usuarioSchema.methods.validatePassword = function (contrasena) {
	return bcrypt.compare(contrasena, this.contrasena);
}

module.exports = mongoose.model('usuarios', usuarioSchema);
