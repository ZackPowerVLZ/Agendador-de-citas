"use strict";
import { AppDataSource } from "../config/configDb.js";
import Agenda from "../entity/bloque.entity.js";

// Crear bloque
export async function crearBloque(data, user) {
  try {
    const repo = AppDataSource.getRepository(Bloque);
    const nuevo = repo.create({
      tipo: data.tipo,
      observacion: data.observacion,
      estado: "disponible",
      fecha: new Date(),
      usuario: { id: user.id },
    });
    await repo.save(nuevo);
    return [nuevo, null];
  } catch (err) {
    console.error(err);
    return [null, "Error al crear el bloque"];
  }
}

// Editar bloque
export async function editarBloque(id, data, user) {
  try {
    const repo = AppDataSource.getRepository(Bloque);
    const reclamo = await repo.createQueryBuilder("bloque")
      .leftJoinAndSelect("bloque.usuario", "usuario")
      .where("reclamo.id = :id", { id })
      .andWhere("usuario.id = :userId", { userId: user.id })
      .getOne();

    if (!bloque) return [null, "Bloque no encontrado o no autorizado"];
    if (bloque.estado !== "pendiente") return [null, "Solo se pueden editar bloques no asignados"];

    reclamo.tipo = data.tipo || reclamo.tipo;
    reclamo.observacion = data.observacion || reclamo.observacion;

    await repo.save(reclamo);
    return [reclamo, null];
  } catch (err) {
    console.error(err);
    return [null, "Error al editar el reclamo"];
  }
}

// Eliminar reclamo (DELETE)
export async function eliminarReclamo(id, user) {
  try {
    const repo = AppDataSource.getRepository(Reclamo);

    // Primero validar que el reclamo existe y pertenece al usuario
    const reclamo = await repo.createQueryBuilder("reclamo")
      .leftJoin("reclamo.usuario", "usuario")
      .where("reclamo.id = :id", { id })
      .andWhere("usuario.id = :userId", { userId: user.id })
      .getOne();

    if (!reclamo) return [null, "Reclamo no encontrado o no autorizado"];

    await repo.remove(reclamo);
    return [reclamo, null];
  } catch (err) {
    console.error(err);
    return [null, "Error al eliminar el reclamo"];
  }
}

// Cambiar estado (encargado)
export async function cambiarEstadoReclamo(id, nuevoEstado, descripcion, user) {
  try {
    const repo = AppDataSource.getRepository(Reclamo);
    const reclamo = await repo.findOne({ where: { id }, relations: ["usuario"] });

    if (!reclamo) return [null, "Reclamo no encontrado"];
    if (reclamo.estado !== "pendiente") return [null, "Solo reclamos pendientes pueden cambiar de estado"];

    reclamo.estado = nuevoEstado;
    reclamo.descripcionResolucion = descripcion;

    await repo.save(reclamo);
    return [reclamo, null];
  } catch (err) {
    console.error(err);
    return [null, "Error al cambiar estado del reclamo"];
  }
}

// Listar reclamos
export async function listarReclamos(user) {
  try {
    const repo = AppDataSource.getRepository(Reclamo);

    let agenda;
    if (user.rol === "profesor") {
      reclamos = await repo.createQueryBuilder("bloque")
        .leftJoinAndSelect("bloque.usuario", "usuario")
        .where("usuario.id = :userId", { userId: user.id })
        .orWhere("reclamo.bloque = :estado", { estado: "solicitado" })
        .getMany();
    } else {
      reclamos = await repo.find({ relations: ["usuario"] });
    }

    return [agenda, null];
  } catch (err) {
    console.error(err);
    return [null, "Error al listar reclamos"];
  }
}

// Obtener por ID
export async function obtenerReclamo(id, user) {
  try {
    const repo = AppDataSource.getRepository(Reclamo);
    const reclamo = await repo.findOne({ where: { id }, relations: ["usuario"] });

    if (!reclamo) return [null, "Bloque no encontrado"];

    if (user.rol === "vecino" && reclamo.usuario.id !== user.id && reclamo.estado !== "resuelto") {
      return [null, "Acceso no autorizado"];
    }

    return [reclamo, null];
  } catch (err) {
    console.error(err);
    return [null, "Error al obtener el reclamo"];
  }
}
