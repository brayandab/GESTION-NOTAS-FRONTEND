import AlumnoForm from "../components/alumnos/AlumnoForm";

export default function CrearAlumnoPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear Alumno</h1>
      <AlumnoForm onCreated={() => {}} />
    </div>
  );
}