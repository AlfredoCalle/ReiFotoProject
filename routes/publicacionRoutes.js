var express = require('express');
var router = express.Router();
var publicacionController = require('../controllers/publicacionController.js');
const imagenController = require('../controllers/imagenController.js');
const fotoController = require('../controllers/fotoController');

router.get('/', publicacionController.list);

router.get('/verPost/:id', publicacionController.verPost); // ok

router.get('/verPostamigo/:id', publicacionController.verPostamigo); // ok

router.get('/editar/:id', publicacionController.verEditarPost); // ok

router.get('/eliminarPost/:id', publicacionController.eliminarPost); // verificando

router.post('/crearpost', fotoController, publicacionController.crearPost); // ok

router.post('/actualizarPost', publicacionController.actualizarPost); // ok

router.post('/darLike', publicacionController.likeFoto);


// router.get('/mostrarTodo', publicacionController.mostrarTodo);

// router.get('/:id', publicacionController.show);

// router.get('/mostrarInfo/:id', publicacionController.mostrarInfo);

// router.post('/crear', imagenController, publicacionController.crear);

// router.put('/darLike', publicacionController.darLike);

// router.put('/actualizar/:id', publicacionController.actualizar);

// router.delete('/eliminar/:id', publicacionController.eliminar);

module.exports = router;