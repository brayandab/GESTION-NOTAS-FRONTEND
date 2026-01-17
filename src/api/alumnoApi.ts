import { api } from "./axiosConfig";
import type { Alumno } from "../models/Alumno";
import type { AlumnoDetalleResponse } from "../pages/AlumnoDetallePage";



export const listarAlumnos = async (): Promise<Alumno[]> => {
  const response = await api.get("/alumnos");
  return response.data.data.content;
};

export const crearAlumno = (alumno: {
  nombre: string;
  apellido: string;
  correo: string;
  fechaNacimiento: string;
}) => {
  return api.post("/alumnos", alumno);
};


export async function obtenerAlumnoPorId(id: number): Promise<Alumno> {
  try {
    const response = await fetch(`http://localhost:8080/alumnos/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Ajusta según la estructura de tu API
    if (data.data) {
      return data.data; // Si viene envuelto en {data: {...}}
    }
    
    return data; // Si viene directamente
  } catch (error) {
    console.error(`Error al obtener alumno ${id}:`, error);
    throw error;
  }
}



export async function obtenerNotasAlumnoPorId(id: number): Promise<AlumnoDetalleResponse> {
  try {
    const response = await fetch(`http://localhost:8080/alumnos/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data: AlumnoDetalleResponse = await response.json();
    return data;
    
  } catch (error) {
    console.error(`Error al obtener alumno ${id}:`, error);
    throw error;
  }
}


// Actualizar alumno
export async function actualizarAlumno(id: number, alumnoData: Partial<Alumno>): Promise<Alumno> {
  try {
    const response = await fetch(`http://localhost:8080/alumnos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alumnoData),
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error(`Error al actualizar alumno ${id}:`, error);
    throw error;
  }
}

// Eliminar alumno
export async function eliminarAlumno(id: number): Promise<void> {
  try {
    const response = await fetch(`http://localhost:8080/alumnos/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error al eliminar alumno ${id}:`, error);
    throw error;
  }
}
