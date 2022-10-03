const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController.js');
const perfilController = require('../controllers/perfil.controller');

/*
 * GET
 */
// router.get('/', usuarioController.list);

/*
 * GET
 */
// router.get('/:id', usuarioController.show);

router.get('/:id', perfilController.verPerfilAmigo);

/*
 * POST
 */
// router.post('/crear', usuarioController.crear); // Usada por la vista registro

/*
 * PUT
 */
// router.put('/:id', usuarioController.update);

/*
 * DELETE
 */
// router.delete('/:id', usuarioController.remove);

module.exports = router;
