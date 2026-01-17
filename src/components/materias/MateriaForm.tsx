import { useEffect, useState } from "react";
import { actualizarMateria, crearMateria, obtenerMateriaPorId } from "../../api/materiaApi";
import { useNavigate, useParams } from "react-router-dom";

interface Props {
  onCreated: () => void;
}

export default function MateriaForm({ onCreated }: Props) {
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [creditos, setCreditos] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);

  const { id } = useParams<{ id: string }>();
  const materiaId = parseInt(id ?? "");
  const navigate = useNavigate(); 
  
  const esIdValido = !isNaN(materiaId) && materiaId > 0;
  
    useEffect(() => {
      const cargarAlumno = async () => {
      
        if (!esIdValido) {
          console.log("No hay ID válido, modo creación");
          setModoEdicion(false);
          return;
        }
  
        try {
          setLoading(true);
          
          const materia = await obtenerMateriaPorId(materiaId);
          
         
          setNombre(materia.nombre || "");
          setCodigo(materia.codigo || "");
          setCreditos(materia.creditos || 0);
                   
        
          setModoEdicion(true);
          
        } catch (error) {
          console.error("Error al cargar materia:", error);
          setError("No se pudo cargar la materia para editar");
          setModoEdicion(false);
        } finally {
          setLoading(false);
        }
      };
  
      cargarAlumno();
    }, [materiaId, esIdValido]); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!codigo || !nombre || creditos <= 0) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      setLoading(true);

      if (modoEdicion && esIdValido) {
        console.log(`Actualizando materia ID: ${materiaId}`);
         await actualizarMateria(materiaId, {
                  id: materiaId,
                  nombre,
                  codigo,
                  creditos,
                });
                
                navigate("/materias", {
                  state: {
                    message: `Materia "${nombre}" actualizada exitosamente`,
                    type: "success"
                  }
                });
      }else {
      await crearMateria({
        codigo,
        nombre,
        creditos,
      }
    );

      navigate("/materias", {
                  state: {
                    message: `Materia "${nombre}" actualizada exitosamente`,
                    type: "success"
                  }
                });

      setCodigo("");
      setNombre("");
      setCreditos(0);

      onCreated(); 
    }

    
    } catch {
  setError("Error al crear la materia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow mb-6"
    >
      <h2 className="text-lg font-semibold mb-4">Crear Materia</h2>

      {error && (
        <p className="text-red-600 text-sm mb-2">{error}</p>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Créditos"
          value={creditos}
          onChange={(e) => setCreditos(Number(e.target.value))}
          className="border p-2 rounded"
        />
      </div>

      <button
  type="submit"
  disabled={loading}
  className="mt-6 w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
>
  {loading ? "Guardando..." : "Crear Materia"}
    </button>

    </form>
  );
}
