"use strict";
import Joi from "joi";

export const crearAgendaSchema = Joi.object({
  tipo: Joi.string().min(3).max(100).required(),
  observacion: Joi.string().allow('', null),
});

export const editarAgendaSchema = Joi.object({
  tipo: Joi.string().min(3).max(100).required(),
  observacion: Joi.string().allow('', null),
});

export const cambiarEstadoSchema = Joi.object({
  estado: Joi.string().valid("resuelto", "desestimado").required(),
  descripcionResolucion: Joi.string().min(5).required(),
});

export const obtenerAgendaSchema = Joi.object({
  id: Joi.number().integer().required(),
});

