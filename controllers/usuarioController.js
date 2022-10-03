var UsuarioModel = require('../models/usuarioModel.js');
const PublicacionModel = require('../models/publicacionModel.js');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const borrar = require('fs');
const cloudinary = require('../config/cloudinary.config');

/**
 * usuarioController.js
 *
 * @description :: Server-side logic for managing usuarios.
 */
module.exports = {

    /**
     * usuarioController.list()
     */
    list: function (req, res) {
        UsuarioModel.find(function (err, usuarios) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting usuario.',
                    error: err
                });
            }

            return res.json(usuarios);
        });
    },

    /**
     * usuarioController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        UsuarioModel.findOne({ _id: id }, function (err, usuario) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting usuario.',
                    error: err
                });
            }

            if (!usuario) {
                return res.status(404).json({
                    message: 'No such usuario'
                });
            }

            return res.json(usuario);
        });
    },

    crear: async function (req, res) {
        const usuario = new UsuarioModel({
            nombre: req.body.nombre,
            usuario: (req.body.nombre).split(" ")[0] + '_' + Date.now(),
            email: req.body.email,
            contrasena: req.body.password,
            genero: req.body.genero,
            descripcion: 'Hola! Estoy usando Rei Foto',
            cantidadPublicaciones: 0,
            cantidadSeguidores: 0,
            cantidadSeguidos: 0
        });

        usuario.contrasena = await usuario.encryptPassword(usuario.contrasena);

        const existeUsuario = await UsuarioModel.find({ email: req.body.email });
        if (existeUsuario && existeUsuario.length > 0) return res.status(409).send("Usted ya tiene una cuenta registrada a su correo");

        const user = await usuario.save();
        // Creo un token
        const token = jwt.sign({ id: user._id, nombre: user.nombre }, 'dante', { expiresIn: '24h' });
        // Creo una cookie
        const serializado = cookie.serialize('token_user', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24// 1 día (1dia 24h/1dia * 60min/1h * 60seg/1min) | maxAge recie en segundo
        });
        // Guardamos la cookie en el header
        res.setHeader('Set-Cookie', serializado);

        return res.redirect('/perfil');

        // usuario.save(function (err, user) {
        //     if (err) {
        //         return res.status(500).json({
        //             message: 'Error when creating usuario',
        //             error: err
        //         });
        //     }

        //     // Creo un token
        //     const token = jwt.sign({ id: user._id, nombre: user.nombre }, 'dante', { expiresIn: '24h' });
        //     // Creo una cookie
        //     const serializado = cookie.serialize('token_user', token, {
        //         httpOnly: true,
        //         maxAge: 60 * 60 * 24 // 1 día (1dia 24h/1dia * 60min/1h * 60seg/1min) | maxAge recie en segundo
        //     });
        //     // Guardamos la cookie en el header
        //     res.setHeader('Set-Cookie', serializado);

        //     return res.redirect('/usuarios/fotoperfil');
        // });
    },
    // Guarda y registra la foto de perfil del usuario en la BD
    guardarFotoPerfil: async function (req, res) {
        console.log('Estoy en guardarFotoperfil');
        const { token_user } = req.cookies;
        if (!token_user) return res.redirect('/login');

        try {
            const user = jwt.verify(token_user, 'dante');

            const usuario = await UsuarioModel.findById(user.id);
            if (!usuario) return res.sendStatus(404);

            if (req.file) {
                const pathImagen = 'public/images/' + req.file.filename;
                // Sube la imagen a Claudinary
                const infoImagenClaudinary = await cloudinary.subirImagen(pathImagen);
                console.log('infoclaudinary', infoImagenClaudinary);

                if (usuario.fotoperfil_public_id) {
                    // Eliminar imagen de claudinary
                    await cloudinary.borrarImagen(usuario.fotoperfil_public_id);
                }

                usuario.fotoperfil_public_id = infoImagenClaudinary.public_id;
                usuario.fotoperfil_url = infoImagenClaudinary.secure_url;

                // Elimina la imagen local almacenada.
                if (borrar.existsSync(pathImagen)) {
                    borrar.unlinkSync(pathImagen);
                }
            }

            // if (req.file) {
            //     if (req.file.filename) {
            //         let nombrerImagen = 'public/images/' + (usuario.fotoperfil);
            //         if (borrar.existsSync(nombrerImagen)) {
            //             borrar.unlinkSync(nombrerImagen);
            //         }
            //         usuario.fotoperfil = req.file.filename ? req.file.filename : usuario.fotoperfil;
            //     }
            // }

            await usuario.save();

            res.redirect('/perfil');

        } catch (error) {
            console.log('Error', error);
            return res.redirect('/login');
        }
    },
    // Guarda la descripcion
    actualizarDescripcion: async function (req, res) {
        const { token_user } = req.cookies;
        if (!token_user) return res.redirect('/login');

        try {
            const user = jwt.verify(token_user, 'dante');

            const usuario = await UsuarioModel.findById(user.id);
            if (!usuario) return res.sendStatus(404);

            usuario.descripcion = req.body.descripcion;

            await usuario.save();

            res.redirect('/perfil');

        } catch (error) {
            return res.redirect('/login');
        }
    },

    // Guarda el nombre del usuario
    actualizarNameUsuario: async function (req, res) {
        const { token_user } = req.cookies;
        if (!token_user) return res.redirect('/login');

        try {
            const user = jwt.verify(token_user, 'dante');

            const usuario = await UsuarioModel.findById(user.id);
            if (!usuario) return res.sendStatus(404);

            usuario.usuario = req.body.usuario;

            await usuario.save();

            res.redirect('/perfil');

        } catch (error) {
            return res.redirect('/login');
        }
    },

    // fotoPerfil: function (req, res) {
    //     return res.render('editarfotoperfil');
    // },

    /**
     * usuarioController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        UsuarioModel.findOne({ _id: id }, function (err, usuario) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting usuario',
                    error: err
                });
            }

            if (!usuario) {
                return res.status(404).json({
                    message: 'No such usuario'
                });
            }

            usuario.nombre = req.body.nombre ? req.body.nombre : usuario.nombre;
            usuario.email = req.body.email ? req.body.email : usuario.email;
            usuario.contrasena = req.body.contrasena ? req.body.contrasena : usuario.contrasena;

            usuario.save(function (err, usuario) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating usuario.',
                        error: err
                    });
                }

                return res.json(usuario);
            });
        });
    },

    /**
     * usuarioController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UsuarioModel.findByIdAndRemove(id, function (err, usuario) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the usuario.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
