const PublicacionModel = require('../models/publicacionModel.js');
const UsuarioModel = require('../models/usuarioModel.js');
const borrar = require('fs'); // Utilizado para borrar archivos
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const cloudinary = require('../config/cloudinary.config');

module.exports = {

    /**
     * publicacionController.list()
     */
    list: function (req, res) {
        PublicacionModel.find(function (err, publicacions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting publicacion.',
                    error: err
                });
            }

            return res.json(publicacions);
        });
    },
    // Muestra la vista de inicio
    verInicio: async function (req, res, next) {
        const { token_user } = req.cookies;
        if (!token_user) return res.redirect('/login');

        try {
            const user = jwt.verify(token_user, 'dante');

            const publicaciones = await PublicacionModel.find({ usuarioID: { $ne: user.id } }).populate('usuarioID', 'nombre _id usuario');
            if (!publicaciones) return res.sendStatus(404);

            return res.render('inicio', { publicaciones: publicaciones });

        } catch (error) {
            return res.redirect('/login');
        }
    },

    // verPerfil: async function (req, res, next) {
    //     const { token_user } = req.cookies;
    //     if (!token_user) return res.redirect('/login');

    //     try {
    //         const user = jwt.verify(token_user, 'dante');

    //         const publicaciones = await PublicacionModel.find().populate('usuarioID', 'nombre');
    //         if (!publicaciones) return res.sendStatus(404);

    //         res.render('perfil', { publicaciones: publicaciones });

    //     } catch (error) {
    //         return res.redirect('/login');
    //     }
    // },

    // Muestra la vista editarpost
    verEditar: function (req, res, next) {
        res.render('editarpost');
    },

    mostrarTodo: function (req, res) {
        PublicacionModel.find({}).populate('usuarioID', 'nombre').exec(function (error, publicaciones) {
            if (error) {
                return res.status(500).json({
                    message: 'Error when getting publicaciones.',
                    error: error
                });
            }

            if (!publicaciones) {
                return res.status(404).json({
                    message: 'No such publicaciones'
                });
            }
            return res.json(publicaciones);
        });
    },

    /**
     * publicacionController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        PublicacionModel.findOne({ _id: id }, function (err, publicacion) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting publicacion.',
                    error: err
                });
            }

            if (!publicacion) {
                return res.status(404).json({
                    message: 'No such publicacion'
                });
            }

            return res.json(publicacion);
        });
    },

    mostrarInfo: function (req, res) {
        const id = req.params.id;
        const soloMostrar = 'nombre';
        PublicacionModel.findOne({ _id: id }).populate('usuarioID', soloMostrar).exec(function (error, publicacion) {
            if (error) {
                return res.status(500).json({
                    message: 'Error when getting publicacion.',
                    error: error
                });
            }

            if (!publicacion) {
                return res.status(404).json({
                    message: 'No such publicacion'
                });
            }
            return res.json(publicacion);
        });
    },

    darLike: function (req, res) {
        const id = req.body.id;
        PublicacionModel.findOne({ _id: id }, function (err, publicacion) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting publicacion',
                    error: err
                });
            }

            if (!publicacion) {
                return res.status(404).json({
                    message: 'No such publicacion'
                });
            }

            publicacion.likes += 1;
            publicacion.save(function (err, publicacion) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating publicacion.',
                        error: err
                    });
                }

                return res.json(publicacion);
            });
        });
    },
    // Muestra la vista crearpost
    verCrear: async function (req, res) {
        const { token_user } = req.cookies;
        if (!token_user) return res.redirect('/login');

        try {
            const user = jwt.verify(token_user, 'dante');

            const publicaciones = await PublicacionModel.find().populate('usuarioID', 'nombre');
            if (!publicaciones) return res.sendStatus(404);

            res.render('crearpost');

        } catch (error) {
            return res.redirect('/login');
        }
    },

    /**
     * publicacionController.create()
     */
    create: function (req, res) {
        var publicacion = new PublicacionModel({
            autor: req.body.autor,
            imagen: req.body.imagen,
            likes: req.body.likes
        });

        publicacion.save(function (err, publicacion) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating publicacion',
                    error: err
                });
            }

            return res.status(201).json(publicacion);
        });
    },

    crear: function (req, res) {
        var publicacion = new PublicacionModel({
            //autor : req.body.autor,
            imagen: req.file.filename,
            likes: 0,
            descripcion: req.body.descripcion,
            usuarioID: req.body.usuarioID
        });

        publicacion.save(function (err, publicacion) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating publicacion',
                    error: err
                });
            }

            return res.status(201).json(publicacion);
        });
    },

    verPost: async function (req, res) {
        const { token_user } = req.cookies;
        if (!token_user) return res.redirect('/login');

        try {
            const user = jwt.verify(token_user, 'dante');

            const usuario = await UsuarioModel.findById(user.id);
            if (!usuario) return res.sendStatus(404);

            const publicacion = await PublicacionModel.findById(req.params.id);
            if (!publicacion) return res.sendStatus(404);

            res.render('verpost', { publicacion: publicacion });

        } catch (error) {
            return res.redirect('/login');
        }
    },

    verPostamigo: async function (req, res) {
        const { token_user } = req.cookies;
        if (!token_user) return res.redirect('/login');

        try {
            const user = jwt.verify(token_user, 'dante');

            const usuario = await UsuarioModel.findById(user.id);
            if (!usuario) return res.sendStatus(404);

            const publicacion = await PublicacionModel.findById(req.params.id);
            if (!publicacion) return res.sendStatus(404);

            res.render('verpostamigo', { publicacion: publicacion });

        } catch (error) {
            return res.redirect('/login');
        }
    },

    eliminarPost: async function (req, res) {
        const { token_user } = req.cookies;
        if (!token_user) return res.redirect('/login');

        try {
            const user = jwt.verify(token_user, 'dante');

            const usuario = await UsuarioModel.findById(user.id);
            if (!usuario) return res.sendStatus(404);

            const publicacion = await PublicacionModel.findById(req.params.id);
            if (!publicacion) return res.sendStatus(404);

            // Elimina la imagen local almacenada.
            // var nombrerImagen = 'public/images/' + (publicacion.imagen);
            // if (borrar.existsSync(nombrerImagen)) {
            //     borrar.unlinkSync(nombrerImagen);
            // }

            // Eliminar imagen de claudinary
            await cloudinary.borrarImagen(publicacion.imagen_public_id);
            usuario.cantidadPublicaciones = usuario.cantidadPublicaciones - 1;

            await usuario.save();
            await PublicacionModel.findByIdAndRemove(req.params.id);

            res.redirect('/perfil');

        } catch (error) {
            return res.redirect('/login');
        }
    },

    // Guarda las fotos
    crearPost: async function (req, res) {
        const { token_user } = req.cookies;
        if (!token_user) return res.redirect('/login');

        try {
            const user = jwt.verify(token_user, 'dante');

            const usuario = await UsuarioModel.findById(user.id);
            if (!usuario) return res.sendStatus(404);

            usuario.cantidadPublicaciones++;

            const publicacion = new PublicacionModel({
                imagen: req.file.filename,
                likes: 0,
                descripcion: req.body.descripcion,
                usuarioID: user.id
            });

            if (req.file) {
                const pathImagen = 'public/images/' + (req.file.filename);
                // Sube la imagen a Claudinary
                const infoImagenClaudinary = await cloudinary.subirImagen(pathImagen);
                console.log('infoclaudinary', infoImagenClaudinary);
                publicacion.imagen_public_id = infoImagenClaudinary.public_id;
                publicacion.imagen_url = infoImagenClaudinary.secure_url;

                // Elimina la imagen local almacenada.
                if (borrar.existsSync(pathImagen)) {
                    borrar.unlinkSync(pathImagen);
                }
            }


            await publicacion.save();
            await usuario.save();

            console.log('Se guardo la foto');

            res.redirect('/perfil');

        } catch (error) {
            console.log("Error: ", error);
            return res.redirect('/login');
        }
    },

    verEditarPost: async function (req, res) {
        const { token_user } = req.cookies;
        if (!token_user) return res.redirect('/login');

        try {
            const user = jwt.verify(token_user, 'dante');

            const usuario = await UsuarioModel.findById(user.id);
            if (!usuario) return res.sendStatus(404);

            const publicacion = await PublicacionModel.findById(req.params.id);
            if (!publicacion) return res.sendStatus(404);

            res.render('editarpost', { publicacion: publicacion });

        } catch (error) {
            return res.redirect('/login');
        }
    },

    actualizarPost: async function (req, res) {
        const { token_user } = req.cookies;
        if (!token_user) return res.redirect('/login');

        try {
            const user = jwt.verify(token_user, 'dante');

            const usuario = await UsuarioModel.findById(user.id);
            if (!usuario) return res.sendStatus(404);

            const publicacion = await PublicacionModel.findById(req.body.idPublicacion);
            if (!publicacion) return res.sendStatus(404);

            publicacion.descripcion = req.body.descripcion;

            await publicacion.save();

            console.log('Se actualizo la descripcion de foto');

            res.redirect('/perfil');

        } catch (error) {
            return res.redirect('/login');
        }
    },

    likeFoto: async function (req, res) {

        const { token_user } = req.cookies;
        if (!token_user) return res.redirect('/login');

        try {
            const user = jwt.verify(token_user, 'dante');

            const usuario = await UsuarioModel.findById(user.id);
            if (!usuario) return res.sendStatus(404);

            const publicacion = await PublicacionModel.findById(req.body.idPublicacion);
            if (!publicacion) return res.sendStatus(404);

            publicacion.likes++;

            await publicacion.save();

            // res.redirect('/inicio');
            res.redirect('back');

        } catch (error) {
            return res.redirect('/login');
        }
    },

    actualizar: function (req, res) {
        var id = req.params.id;

        PublicacionModel.findOne({ _id: id }, function (err, publicacion) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting publicacion',
                    error: err
                });
            }

            if (!publicacion) {
                return res.status(404).json({
                    message: 'No such publicacion'
                });
            }
            publicacion.descripcion = req.body.descripcion ? req.body.descripcion : publicacion.descripcion;
            //publicacion.autor = req.body.autor ? req.body.autor : publicacion.autor;
            //publicacion.imagen = req.body.imagen ? req.body.imagen : publicacion.imagen;
            //publicacion.likes = req.body.likes ? req.body.likes : publicacion.likes;

            publicacion.save(function (err, publicacion) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating publicacion.',
                        error: err
                    });
                }

                return res.json(publicacion);
            });
        });
    },

    eliminar: function (req, res) {
        var id = req.params.id;

        PublicacionModel.findOne({ _id: id }, function (err, publicacion) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting publicacion',
                    error: err
                });
            }

            if (!publicacion) {
                return res.status(404).json({
                    message: 'No such publicacion'
                });
            }

            // Elimina la imagen almacenada.
            var nombrerImagen = 'public/images/' + (publicacion.imagen);
            if (borrar.existsSync(nombrerImagen)) {
                borrar.unlinkSync(nombrerImagen);
            }

            PublicacionModel.findByIdAndRemove(id, function (err, publicacion) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when deleting the publicacion.',
                        error: err
                    });
                }

                return res.status(204).json();
            });
        });
    }
};
