import { api } from "./axiosConfig";
import type { Materia } from "../models/Materia";

export const listarMaterias = async (): Promise<Materia[]> => {
  const response = await api.get("/materias");
  return response.data.data.content;
};

export const crearMateria = (materia: {
  codigo: string;
  nombre: string;
  creditos: number;
}) => {
  return api.post("/materias", materia);
};


export async function obtenerMateriaPorId(id: number): Promise<Materia> {
  try {
    const response = await fetch(`http://localhost:8080/materias/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
   
    if (data.data) {
      return data.data; 
    }
    
    return data; 
  } catch (error) {
    console.error(`Error al obtener alumno ${id}:`, error);
    throw error;
  }
}


export async function actualizarMateria(id: number, materiaData: Partial<Materia>): Promise<Materia> {
  try {
    const response = await fetch(`http://localhost:8080/materias/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(materiaData),
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error(`Error al actualizar materia ${id}:`, error);
    throw error;
  }
}


export async function eliminarMateria(id: number): Promise<void> {
  try {
    const response = await fetch(`http://localhost:8080/materias/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error al eliminar materia ${id}:`, error);
    throw error;
  }
}