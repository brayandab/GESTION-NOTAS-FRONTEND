import { useEffect, useState } from "react";
import { actualizarAlumno, crearAlumno, obtenerAlumnoPorId} from "../../api/alumnoApi";
import { useNavigate, useParams } from "react-router-dom";

interface Props {
  onCreated: () => void;
}

export default function AlumnoForm({ onCreated }: Props) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false); 

  const { id } = useParams<{ id: string }>();
  const alumnoId = parseInt(id ?? "");
  const navigate = useNavigate(); 


  const esIdValido = !isNaN(alumnoId) && alumnoId > 0;

  useEffect(() => {
    const cargarAlumno = async () => {
    
      if (!esIdValido) {
        setModoEdicion(false);
        return;
      }

      try {
        setLoading(true);        
        const alumno = await obtenerAlumnoPorId(alumnoId);
        
       
        setNombre(alumno.nombre || "");
        setApellido(alumno.apellido || "");
        setCorreo(alumno.correo || "");
        
      
        const fechaFormateada = alumno.fechaNacimiento 
          ? alumno.fechaNacimiento.substring(0, 10) 
          : "";
        setFechaNacimiento(fechaFormateada);
        
      
        setModoEdicion(true);
        
        console.log("Alumno cargado para edición:", alumno);
      } catch (error) {
        console.error("Error al cargar alumno:", error);
        setError("No se pudo cargar el alumno para editar");
        setModoEdicion(false);
      } finally {
        setLoading(false);
      }
    };

    cargarAlumno();
  }, [alumnoId, esIdValido]); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nombre || !apellido || !correo || !fechaNacimiento) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      setLoading(true);
      
            if (modoEdicion && esIdValido) {
      
        console.log(`Actualizando alumno ID: ${alumnoId}`);
        
        await actualizarAlumno(alumnoId, {
          id: alumnoId,
          nombre,
          apellido,
          correo,
          fechaNacimiento,
        });
        
        navigate("/alumnos", {
          state: {
            message: `Alumno "${nombre} ${apellido}" actualizado exitosamente`,
            type: "success"
          }
        });

        console.log("Alumno actualizado exitosamente");
      } else {
        // MODO CREACIÓN: Crear nuevo alumno
        console.log("Creando nuevo alumno");
        
        await crearAlumno({
          nombre,
          apellido,
          correo,
          fechaNacimiento,
        });
        
        // Limpiar formulario solo en modo creación
        setNombre("");
        setApellido("");
        setCorreo("");
        setFechaNacimiento("");
      }

      // Notificar éxito
      onCreated();
      
    } catch (error: unknown) {
      console.error("Error al guardar alumno:", error);
      
      const mensajeError = modoEdicion 
        ? "Error al actualizar el alumno" 
        : "Error al crear el alumno";
      
      if (error instanceof Error) {
        setError(`${mensajeError}: ${error.message}`);
      } else {
        setError(mensajeError);
      }
    }
  };
  

  
  const tituloFormulario = modoEdicion ? "Editar Alumno" : "Crear Alumno";
  const textoBoton = modoEdicion ? "Actualizar Alumno" : "Crear Alumno";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow mb-6"
    >
     
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{tituloFormulario}</h2>
        {modoEdicion && (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            ID: {alumnoId}
          </span>
        )}
      </div>

     
      {modoEdicion && (
        <input type="hidden" name="alumnoId" value={alumnoId} />
      )}

      {error && (
        <p className="text-red-600 text-sm mb-3">{error}</p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border p-2 rounded-lg"
          disabled={loading}
        />

        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          className="border p-2 rounded-lg"
          disabled={loading}
        />

        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="border p-2 rounded-lg md:col-span-2"
          disabled={loading}
        />

        <input
          type="date"
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
          className="border p-2 rounded-lg"
          disabled={loading}
        />
      </div>

      
      <button
        type="submit"
        disabled={loading}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Guardando..." : textoBoton}
      </button>

      
      <div className="mt-4 text-sm text-gray-500">
        {modoEdicion ? (
          <p>Modo edición: Modifica los campos y haz clic en "Actualizar"</p>
        ) : (
          <p>Modo creación: Completa los campos y haz clic en "Crear"</p>
        )}
      </div>
    </form>
  );
}