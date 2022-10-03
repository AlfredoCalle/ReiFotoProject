const UsuarioModel = require('../models/usuarioModel');
const PublicacionModel = require('../models/publicacionModel');
const jwt = require('jsonwebtoken');

module.exports = {

    // Muestra y obtiene la info del perfil del usuario
    verPerfilPersonal: async function (req, res) {
        const { token_user } = req.cookies;
        if (!token_user) return res.redirect('/login');

        try {
            const tokenUser = jwt.verify(token_user, 'dante');

            const user = await UsuarioModel.findById(tokenUser.id);
            if (!user) return res.sendStatus(404);
            user.contrasena = '';
            user.email = '';

            const publicaciones = await PublicacionModel.find({ usuarioID: tokenUser.id });
            if (!publicaciones) return res.sendStatus(404);

            res.render('perfil', { usuario: user, publicaciones: publicaciones });

        } catch (error) {
            return res.redirect('/login');
        }
    },
    // Muestra y obtiene la info del perfil del amigo
    verPerfilAmigo: async function (req, res) {
        const { token_user } = req.cookies;
        if (!token_user) return res.redirect('/login');

        try {
            const tokenUser = jwt.verify(token_user, 'dante');

            const user = await UsuarioModel.findById(req.params.id);
            if (!user) return res.sendStatus(404);
            user.contrasena = '';
            user.email = '';

            const publicaciones = await PublicacionModel.find({ usuarioID: req.params.id });
            if (!publicaciones) return res.sendStatus(404);

            res.render('perfilamigo', { usuario: user, publicaciones: publicaciones });

        } catch (error) {
            return res.redirect('/login');
        }
    }
}