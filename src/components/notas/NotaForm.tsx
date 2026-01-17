import { useEffect, useState } from "react";
import { crearNota } from "../../api/notaApi";
import { listarMaterias } from "../../api/materiaApi";
import { useNavigate } from "react-router-dom";
import type { Materia } from "../../models/Materia";    
import type { Alumno } from './../../models/Alumno';
import { listarAlumnos } from "../../api/alumnoApi";

interface Props {
  onCreated: () => void;
}

export default function NotaForm({ onCreated }: Props) {
  const [valor, setValor] = useState("");
  const [fechaRegistro, setFechaRegistro] = useState("");
  const [alumnoId, setAlumnoId] = useState("");
  const [materiaId, setMateriaId] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");

  const [materias, setMaterias] = useState<Materia[]>([]);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [busquedaMateria, setBusquedaMateria] = useState("");
  const [busquedaAlumno, setBusquedaAlumno] = useState("");

  const navigate = useNavigate(); 

  // ✅ 1. CARGAR MATERIAS Y ALUMNOS SEPARADAMENTE
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        setLoadingData(true);
        setError("");
        
        console.log("Cargando materias y alumnos...");
        
        // Cargar materias y alumnos en paralelo
        const [materiasData, alumnosData] = await Promise.all([
          listarMaterias(),
          listarAlumnos()
        ]);
        
        console.log("Materias cargadas:", materiasData);
        console.log("Alumnos cargados:", alumnosData);
        
        setMaterias(materiasData || []);
        setAlumnos(alumnosData || []);
        
      } catch (err) {
        console.error("Error al cargar datos iniciales:", err);
        setError("No se pudieron cargar las materias y alumnos");
      } finally {
        setLoadingData(false);
      }
    };

    cargarDatosIniciales();
  }, []); // ✅ Solo se ejecuta una vez al montar

  // Filtrar materias según búsqueda
  const materiasFiltradas = materias.filter(materia =>
    materia.nombre?.toLowerCase().includes(busquedaMateria.toLowerCase()) ||
    materia.codigo?.toLowerCase().includes(busquedaMateria.toLowerCase())
  );

  // Filtrar alumnos según búsqueda
  const alumnosFiltrados = alumnos.filter(alumno =>
    alumno.nombre?.toLowerCase().includes(busquedaAlumno.toLowerCase()) ||
    alumno.apellido?.toLowerCase().includes(busquedaAlumno.toLowerCase()) ||
    alumno.correo?.toLowerCase().includes(busquedaAlumno.toLowerCase())
  );

  // ✅ Función para obtener mensaje de error
  const obtenerMensajeError = (err: unknown): string => {
    if (err instanceof Error) {
      return err.message;
    }
    
    if (typeof err === 'string') {
      return err;
    }
    
    // Si es un objeto de respuesta de axios/fetch
    if (err && typeof err === 'object' && 'response' in err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      return axiosError.response?.data?.message || "Error en la respuesta del servidor";
    }
    
    return "Error desconocido al crear la nota";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ✅ 2. VALIDACIÓN COMPLETA
    if (!valor || !fechaRegistro || !materiaId || !alumnoId) {
      setError("Todos los campos son obligatorios");
      return;
    }

    // Validar que los IDs sean números
    const materiaIdNum = parseInt(materiaId);
    const alumnoIdNum = parseInt(alumnoId);
    
    if (isNaN(materiaIdNum) || isNaN(alumnoIdNum)) {
      setError("Por favor selecciona una materia y un alumno válidos");
      return;
    }

    // Validar que el valor sea un número
    const valorNum = parseFloat(valor);
    if (isNaN(valorNum)) {
      setError("El valor debe ser un número");
      return;
    }

    try {
      setLoading(true);

      console.log("Enviando datos:", {
        valor: valorNum,
        fechaRegistro,
        materiaId: materiaIdNum,
        alumnoId: alumnoIdNum
      });

      // ✅ 3. LLAMAR A LA API CORRECTAMENTE
      await crearNota({
        id: 0, // Asumiendo que el backend asigna el ID
        valor: valorNum,
        fechaRegistro,
        materiaId: materiaIdNum,
        alumnoId: alumnoIdNum
      });

      // ✅ 4. REDIRECCIONAR Y LIMPIAR
      navigate("/notas", { // Asegúrate que esta ruta sea correcta
        state: {
          message: `Nota creada exitosamente`,
          type: "success"
        }
      });

      // Limpiar formulario
      setValor("");
      setFechaRegistro("");
      setMateriaId("");
      setAlumnoId("");
      setBusquedaMateria("");
      setBusquedaAlumno("");

      // Notificar éxito
      onCreated();
      
    } catch (err) { // ✅ CORREGIDO: Cambiado de 'any' a sin tipo (o 'unknown')
      console.error("Error al crear nota:", err);
      
      // ✅ Usar la función helper para obtener el mensaje
      const mensajeError = obtenerMensajeError(err);
      setError(mensajeError);
      
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Cargando materias y alumnos...</p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-6">Crear Nueva Nota</h2>

      {/* Mensaje de error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Información de datos cargados */}
      <div className="mb-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div className="p-3 bg-blue-50 rounded-lg">
          <span className="font-medium">{materias.length}</span> materias cargadas
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <span className="font-medium">{alumnos.length}</span> alumnos cargados
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sección de Materia */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Materia
            </label>
            <input
              type="text"
              placeholder="Escribe para buscar materia..."
              value={busquedaMateria}
              onChange={(e) => setBusquedaMateria(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Materia <span className="text-red-500">*</span>
            </label>
            <select
              value={materiaId}
              onChange={(e) => setMateriaId(e.target.value)}
              disabled={loading || loadingData}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-50"
              size={5}
            >
              <option value="">-- Selecciona una materia --</option>
              {materiasFiltradas.length === 0 ? (
                <option disabled>
                  {busquedaMateria ? "No se encontraron materias" : "No hay materias disponibles"}
                </option>
              ) : (
                materiasFiltradas.map((materia) => (
                  <option key={materia.id} value={materia.id}>
                    {materia.codigo} | {materia.nombre} ({materia.creditos} créditos)
                  </option>
                ))
              )}
            </select>
            
            {materiaId && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Materia seleccionada:</span>{" "}
                  {materias.find(m => m.id === parseInt(materiaId))?.nombre}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sección de Alumno */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Alumno
            </label>
            <input
              type="text"
              placeholder="Escribe para buscar alumno..."
              value={busquedaAlumno}
              onChange={(e) => setBusquedaAlumno(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Alumno <span className="text-red-500">*</span>
            </label>
            <select
              value={alumnoId}
              onChange={(e) => setAlumnoId(e.target.value)}
              disabled={loading || loadingData}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-50"
              size={5}
            >
              <option value="">-- Selecciona un alumno --</option>
              {alumnosFiltrados.length === 0 ? (
                <option disabled>
                  {busquedaAlumno ? "No se encontraron alumnos" : "No hay alumnos disponibles"}
                </option>
              ) : (
                alumnosFiltrados.map((alumno) => (
                  <option key={alumno.id} value={alumno.id}>
                    {alumno.nombre} {alumno.apellido} | {alumno.correo}
                  </option>
                ))
              )}
            </select>
            
            {alumnoId && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">
                  <span className="font-medium">Alumno seleccionado:</span>{" "}
                  {alumnos.find(a => a.id === parseInt(alumnoId))?.nombre} {alumnos.find(a => a.id === parseInt(alumnoId))?.apellido}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Campos de valor y fecha */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor de la Nota <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            placeholder="Ej: 8.5"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Registro <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={fechaRegistro}
            onChange={(e) => setFechaRegistro(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-50"
          />
        </div>
      </div>

      {/* Botón de enviar */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading || loadingData}
          className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando nota...
            </>
          ) : (
            "Crear Nota"
          )}
        </button>
      </div>

      {/* Información adicional */}
      <div className="mt-4 text-sm text-gray-500">
        <p>
          <span className="text-red-500">*</span> Campos obligatorios
        </p>
        <p className="mt-1">
          Selecciona una materia y un alumno, luego ingresa el valor de la nota y la fecha.
        </p>
      </div>
    </form>
  );
}