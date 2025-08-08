'use strict';
import express from 'express';
import {
  crear,
  editar,
  borrar,
  cambiarEstado,
  listar,
  obtener,
} from '../controllers/agendas.controller.js';
import { authenticateJwt } from '../middlewares/authentication.middleware.js';

const router = express.Router();


router.post('/', authenticateJwt, crear);
router.put('/:id', authenticateJwt, editar);
router.delete('/:id', authenticateJwt, borrar);
router.patch('/:id/estado', authenticateJwt, cambiarEstado);
router.get('/', authenticateJwt, listar);
router.get('/:id', authenticateJwt, obtener);

export default router;
