import { api } from "./axiosConfig";
import type { Nota } from "../models/Nota";

export const listarNotas = async (): Promise<Nota[]> => {
  const response = await api.get("/notas");
  console.log("Respuesta de listarNotas:", response.data.data.content);
  return response.data.data.content;
};

export const crearNota = (nota: {
  id: number;
  fechaRegistro: string;
  valor: number;
  materiaId: number;
  alumnoId: number;
}) => {
  return api.post("/notas", nota);
};