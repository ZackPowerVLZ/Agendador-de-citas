"use strict";
import { EntitySchema } from "typeorm";

const AgendaSchema = new EntitySchema({
  name: "Agenda",
  tableName: "agendas",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    tipo: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    observacion: {
      type: "text",
      nullable: true,
    },
    fecha: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    estado: {
      type: "varchar",
      length: 20,
      default: "pendiente",
    },
    descripcionResolucion: {
      type: "text",
      nullable: true,
    },
    visible: {
      type: "boolean",
      default: false,
    },
  },
  relations: {
    usuario: {
      target: "User",
      type: "many-to-one",
      joinColumn: true,
      eager: true,
      nullable: false,
    },
  },
});

export default AgendaSchema;
