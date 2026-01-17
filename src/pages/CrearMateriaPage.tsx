import MateriaForm from "../components/materias/MateriaForm";

export default function CrearMateriaPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear Materia</h1>
      <MateriaForm onCreated={() => {}} />
    </div>
  );
}
