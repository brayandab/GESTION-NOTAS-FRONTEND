import NotaForm from "../components/notas/NotaForm";

export default function CrearNotasPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear Notas</h1>
      <NotaForm onCreated={() => {}} />
    </div>
  );
}
