const UsuarioModel = require('../models/usuarioModel.js');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

module.exports = {

    // Muestra la bienvenida (logo y login)
    verBienvenida: function (req, res) {
        const { token_user } = req.cookies;
        if (!token_user) return res.render('bienvenida');

        try {
            jwt.verify(token_user, 'dante');
            return res.redirect('/inicio');
        } catch (error) {
            return res.render('bienvenida');
        }
    },
    // Muestra solo el login
    verlogin: function (req, res) {
        const { token_user } = req.cookies;
        if (!token_user) return res.render('login');

        try {
            jwt.verify(token_user, 'dante');
            return res.redirect('/inicio');
        } catch (error) {
            return res.render('login');
        }
    },
    // Autentica al usuario (crea el token)
    autenticar: async function (req, res) {
        const { email, password } = req.body;

        if (!email || !password) return res.sendStatus(400);

        const user = await UsuarioModel.findOne({ email: email });

        if (!user) return res.sendStatus(401);

        const isValidPassword = await user.validatePassword(password);

        if (!isValidPassword) return res.sendStatus(401);

        // if (user.contrasena !== password) return res.sendStatus(401);

        // Creo un token
        const token = jwt.sign({ id: user._id, nombre: user.nombre }, 'dante', { expiresIn: '24h'});
        // Creo una cookie
        const serializado = cookie.serialize('token_user', token, { 
            httpOnly: true, 
            maxAge: 60 * 60 * 24 // 1 día (1dia 24h/1dia * 60min/1h * 60seg/1min) | maxAge recie en segundo
         });
        // Guardamos la cookie en el header
        res.setHeader('Set-Cookie', serializado);

        return res.redirect('/inicio');
    },
    // Muestra el registro
    verRegistro: function (req, res) {
        const { token_user } = req.cookies;
        if (!token_user) return res.render('registro');

        try {
            jwt.verify(token_user, 'dante');
            return res.redirect('/inicio');
        } catch (error) {
            return res.redirect('/login');
        }
    },
    // Elimina el token generado para usar la aplicacion
    cerrarSesion: function (req, res) {
        const { token_user } = req.cookies;
        if (!token_user) return res.redirect('/');

        try {
            // Verifico si el token es legitimo
            jwt.verify(token_user, 'dante');
            // Creo una cookie para sobreescribir la que existe
            const serializado = cookie.serialize('token_user', null, { maxAge: 0 });
            // Guardamos la cookie en el header
            res.setHeader('Set-Cookie', serializado);

            return res.redirect('/');
        } catch (error) {
            return res.redirect('/');
        }

    }
};