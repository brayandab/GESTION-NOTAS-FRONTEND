// AlumnoDetallePage.tsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { obtenerNotasAlumnoPorId } from "../api/alumnoApi";
import type { Alumno } from "../models/Alumno";
import type { Materia } from "../models/Materia";
import type { Nota } from "../models/Nota";


 
export interface AlumnoDetalleResponse {
  status: number;
  message: string;
  data: Alumno & {
    materias: Array<Materia & {
      notas: Nota[];
    }>;
  };
}

export default function AlumnoDetalleForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [alumno, setAlumno] = useState<AlumnoDetalleResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promedioGeneral, setPromedioGeneral] = useState<number | null>(null);

  useEffect(() => {
    const cargarAlumno = async () => {
      if (!id) {
        setError("ID no proporcionado");
        setLoading(false);
        return;
      }

      const alumnoId = parseInt(id, 10);
      if (isNaN(alumnoId)) {
        setError("ID inválido");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log(`Cargando alumno con ID: ${alumnoId}`);
        const response: AlumnoDetalleResponse = await obtenerNotasAlumnoPorId(alumnoId);
        
        if (response.status === 200) {
          setAlumno(response.data);
          calcularPromedio(response.data);
        } else {
          throw new Error(response.message || "Error al cargar alumno");
        }
      } catch (err) {
        console.error("Error al cargar alumno:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    cargarAlumno();
  }, [id]);

  const calcularPromedio = (alumnoData: AlumnoDetalleResponse['data']) => {
    if (!alumnoData.materias || alumnoData.materias.length === 0) {
      setPromedioGeneral(null);
      return;
    }

    let totalNotas = 0;
    let cantidadNotas = 0;

    alumnoData.materias.forEach(materia => {
      if (materia.notas && materia.notas.length > 0) {
        materia.notas.forEach(nota => {
          totalNotas += nota.valor;
          cantidadNotas++;
        });
      }
    });

    if (cantidadNotas > 0) {
      setPromedioGeneral(totalNotas / cantidadNotas);
    } else {
      setPromedioGeneral(null);
    }
  };

  const formatearFecha = (fechaISO: string) => {
    try {
      return new Date(fechaISO).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return fechaISO;
    }
  };

  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-6"></div>
            <h2 className="text-xl font-semibold text-gray-700">Cargando información del alumno...</h2>
            <p className="text-gray-500 mt-2">ID: {id}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !alumno) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="text-center py-12">
              <div className="inline-block p-4 bg-red-100 rounded-full mb-6">
                <span className="text-red-600 text-3xl">⚠</span>
              </div>
              <h2 className="text-2xl font-bold text-red-700 mb-4">Error</h2>
              <p className="text-gray-600 mb-8">{error || "No se pudo cargar la información del alumno"}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/alumnos")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Volver a Alumnos
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Botón de volver */}
        <div className="mb-6">
          <Link 
            to="/notas" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a la lista de alumnos
          </Link>
        </div>

        {/* Header principal */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {alumno.nombre} {alumno.apellido}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    ID: {alumno.id}
                  </span>
                
                </div>
              </div>
              
              
            </div>

            {/* Información personal */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <span className="text-blue-600">📧</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Correo electrónico</p>
                    <p className="font-medium text-gray-900">{alumno.correo}</p>
                  </div>
                </div>
              </div>


              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <span className="text-purple-600">📚</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total de Materias</p>
                    <p className="font-medium text-gray-900">{alumno.materias?.length || 0}</p>
                  </div>
                </div>
              </div>

              {promedioGeneral !== null && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 ${
                      promedioGeneral >= 3.5 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <span className={promedioGeneral >= 3.5 ? 'text-green-600' : 'text-red-600'}>
                        ⭐
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Promedio General</p>
                      <p className={`font-bold text-lg ${
                        promedioGeneral >= 3.5 ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {promedioGeneral.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sección de Materias y Notas */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Materias y Calificaciones
              </h2>
              <span className="text-sm text-gray-500">
                {alumno.materias?.reduce((total, materia) => total + (materia.notas?.length || 0), 0)} notas totales
              </span>
            </div>

            {!alumno.materias || alumno.materias.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                  <span className="text-gray-400 text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay materias asignadas</h3>
                <p className="text-gray-500 mb-6">Este alumno no está inscrito en ninguna materia</p>
                <Link to="/materias">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Asignar Materias
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {alumno.materias.map((materia) => {
                  const promedioMateria = materia.notas && materia.notas.length > 0
                    ? materia.notas.reduce((sum, nota) => sum + nota.valor, 0) / materia.notas.length
                    : null;

                  return (
                    <div key={materia.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      {/* Header de la materia */}
                      <div className="bg-gray-50 p-4 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {materia.nombre}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-sm text-gray-600">Código: {materia.codigo}</span>
                              <span className="text-sm text-gray-600">•</span>
                              <span className="text-sm text-gray-600">{materia.creditos} créditos</span>
                              <span className="text-sm text-gray-600">•</span>
                              <span className="text-sm text-gray-600">{materia.notas?.length || 0} notas</span>
                            </div>
                          </div>
                          
                          {promedioMateria !== null && (
                            <div className="mt-3 md:mt-0">
                              <div className={`px-4 py-2 rounded-lg ${
                                promedioMateria >= 3.5 ? 'bg-green-100' : 'bg-red-100'
                              }`}>
                                <span className={`font-bold ${
                                  promedioMateria >= 3.5 ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  Promedio: {promedioMateria.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Lista de notas */}
                      <div className="p-4">
                        {!materia.notas || materia.notas.length === 0 ? (
                          <div className="text-center py-6">
                            <p className="text-gray-500">No hay notas registradas en esta materia</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead>
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Valor
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha Registro
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                  </th>
                                 
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {materia.notas.map((nota) => (
                                  <tr key={nota.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                      <div className="flex items-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                          nota.valor >= 3.5 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                          {nota.valor.toFixed(1)}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                      {formatearFecha(nota.fechaRegistro)}
                                    </td>
                                    <td className="px-4 py-3">
                                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                        nota.valor >= 3.5 
                                          ? 'bg-green-100 text-green-800' 
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                                        {nota.valor >= 3.5 ? 'Aprobado' : 'Reprobado'}
                                      </span>
                                    </td>
                                    
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                      {/* Pie de materia */}
                      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {materia.notas?.length || 0} notas registradas
                          </span>
                          <Link to={`/notas/crear?materiaId=${materia.id}&alumnoId=${alumno.id}`}>
                            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                              + Agregar nueva nota
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        
      </div>
    </div>
  );
}