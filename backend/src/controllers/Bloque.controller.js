"use strict";
import * as service from "../services/agendas.services.js";

// Crear 
export async function crear(req, res) {
  const [reclamo, error] = await service.crearBloque(req.body, req.user);
  if (error) return res.status(400).json({ error });
  res.status(201).json({ mensaje: "Agenda agregada con éxito", agenda });
}

// Editar 
export async function editar(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  const [agenda, error] = await service.editarBloque(id, req.body, req.user);
  if (error) return res.status(400).json({ error });

  res.status(200).json({ mensaje: "Bloque actualizado con éxito", bloque });
}

// Borrar 
export async function borrar(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  const [bloque, error] = await service.eliminarBloque(id, req.user);
  if (error) return res.status(400).json({ error });

  res.status(200).json({ mensaje: "Bloque eliminado con éxito", bloque });
}

// Cambiar estado *
export async function cambiarEstado(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  const { estado, descripcion } = req.body;
  if (!["resuelto", "desestimado"].includes(estado)) {
    return res.status(400).json({ error: "Estado no válido" });
  }

  const [bloque, error] = await service.cambiarEstadoBloque(id, estado, descripcion, req.user);
  if (error) return res.status(400).json({ error });

  res.status(200).json({ mensaje: `Bloque marcado como ${bloque.estado}`, bloque });
}

// Listar 
export async function listar(req, res) {
  const [reclamos, error] = await service.listarBloques(req.user);
  if (error) return res.status(400).json({ error });
  res.status(200).json(bloques);
}

// Obtener por ID
export async function obtener(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  const [reclamo, error] = await service.obtenerReclamo(id, req.user);
  if (error) return res.status(404).json({ error });

  res.status(200).json(bloque);
}
