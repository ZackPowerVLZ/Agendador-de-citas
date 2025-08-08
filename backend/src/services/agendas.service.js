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

    bloque.tipo = data.tipo || bloque.tipo;
    bloue.observacion = data.observacion || bloque.observacion;

    await repo.save(bloque);
    return [bloque, null];
  } catch (err) {
    console.error(err);
    return [null, "Error al editar el bloque"];
  }
}

// Eliminar bloque (DELETE)
export async function eliminarBloque(id, user) {
  try {
    const repo = AppDataSource.getRepository(Bloque);

    // Primero validar que el bloque existe y pertenece al usuario
    const bloque = await repo.createQueryBuilder("bloque")
      .leftJoin("bloque.usuario", "usuario")
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
    return [null, "Error al cambiar estado del bloque"];
  }
}

// Listar bloques
export async function listarAgenda(user) {
  try {
    const repo = AppDataSource.getRepository(Bloque);

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
export async function obtenerBloque(id, user) {
  try {
    const repo = AppDataSource.getRepository(Bloque);
    const reclamo = await repo.findOne({ where: { id }, relations: ["usuario"] });

    if (!bloque) return [null, "Bloque no encontrado"];

    if (user.rol === "vecino" && reclamo.usuario.id !== user.id && bloque.estado !== "resuelto") {
      return [null, "Acceso no autorizado"];
    }

    return [reclamo, null];
  } catch (err) {
    console.error(err);
    return [null, "Error al obtener el bloque"];
  }
}
