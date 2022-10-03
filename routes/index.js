const express = require('express');
const router = express.Router();
const publicacionController = require('../controllers/publicacionController');
const authController = require('../controllers/authController');
const imagenController = require('../controllers/imagenController.js');
const usuarioController = require('../controllers/usuarioController.js');
const perfilController = require('../controllers/perfil.controller');

// router.get('/modal', function (req, res) {
//     res.render('modal/editarfotoperfil.modal.ejs');
// });

router.get('/', authController.verBienvenida); // ok

router.get('/login', authController.verlogin); // ok

router.post('/auth', authController.autenticar); // ok

router.get('/registrarse', authController.verRegistro); // ok 

router.post('/registrar', usuarioController.crear); // ok

router.get('/cerrarsesion', authController.cerrarSesion); // ok


router.get('/inicio', publicacionController.verInicio); // ok

router.get('/crear', publicacionController.verCrear); // ok

router.get('/perfil', perfilController.verPerfilPersonal); // ok

router.get('/editar', publicacionController.verEditar); // ok (Revisar)

router.post('/guardarfotoperfil', imagenController, usuarioController.guardarFotoPerfil); // ok

router.post('/actualizarDescripcion', usuarioController.actualizarDescripcion); // ok

router.post('/actualizarNameUsuario', usuarioController.actualizarNameUsuario); // ok

/**
 * Tareas por hacer:
 * completar el boton de like
 * 4. darle estilo a la pagina
 */


// router.get('/nav', function(req, res, next) {
//     res.render('navegacion');
// });

// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Rey&Rei' });
// });

module.exports = router;
