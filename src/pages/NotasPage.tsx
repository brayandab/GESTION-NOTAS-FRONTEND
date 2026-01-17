import { useEffect, useRef, useState } from "react";
import { listarNotas } from "../api/notaApi";
import { Link } from "react-router-dom";
import type { Nota } from "../models/Nota";

interface ModalConfirmacionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titulo: string;
  mensaje: string;
  loading?: boolean;
}


function ModalConfirmacion({ 
  isOpen, 
  onClose, 
  onConfirm, 
  titulo, 
  mensaje, 
  loading = false 
}: ModalConfirmacionProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="relative z-50 bg-white rounded-xl shadow-2xl p-0 w-full max-w-md backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      onClose={onClose}
    >
      <div className="p-6">
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{titulo}</h3>
            <p className="text-sm text-gray-600 mt-1">{mensaje}</p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              dialogRef.current?.close();
            }}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </dialog>
  );
}

// Componente Toast de notificación
interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
      type === 'success' 
        ? 'bg-green-50 border border-green-200 text-green-800' 
        : 'bg-red-50 border border-red-200 text-red-800'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {type === 'success' ? (
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          <span>{message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
}


export default function MateriasPage() {
  const [notas, setNotas] = useState<Nota[]>([]);
  // Estados para toast de notificación
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [notaEliminar, setNotaEliminar] = useState<{ id: number; valor: number } | null>(null);
  

  useEffect(() => {
    listarNotas().then(setNotas);
  }, []);

  // Mostrar toast
  const mostrarToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  
    // Cerrar modal
  const cerrarModal = () => {
    if (!eliminando) {
      setModalOpen(false);
      setNotaEliminar(null);
    }
  };

  // Confirmar eliminación
    const confirmarEliminar = async () => {
      if (!notaEliminar) return;
  
      try {
        setEliminando(true);
        
        //await eliminarNota(notaEliminar.id);
        
        // Optimistic update
        setNotas(prev => prev.filter(nota => nota.id !== notaEliminar.id));
        
        // Mostrar toast de éxito
        mostrarToast(
          `Nota "${notaEliminar.id}" eliminada exitosamente`,
          'success'
        );
        
        // Cerrar modal
        setModalOpen(false);
        setNotaEliminar(null);
        
      } catch (err) {
        console.error("Error al eliminar nota:", err);
        
        // Mostrar toast de error
        const mensajeError = err instanceof Error 
          ? err.message.includes("404") 
            ? "La nota no fue encontrada"
            : "Error al eliminar el registro"
          : "Error al eliminar el registro";
        
         mostrarToast(mensajeError, 'error');
        
        // Recargar datos
       // await cargarMaterias();
        
      } finally {
        setEliminando(false);
      }
    };

  return (
    <div className="p-6 max-w-6xl mx-auto">
          {/* Toast de notificación */}
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
    
          {/* Modal de confirmación */}
          <ModalConfirmacion
            isOpen={modalOpen}
            onClose={cerrarModal}
            onConfirm={confirmarEliminar}
            titulo="Confirmar Eliminación"
            mensaje={
              notaEliminar 
                ? `¿Estás seguro de eliminar la nota "${notaEliminar.id}"?\n\nEsta acción no se puede deshacer.`
                : "¿Estás seguro de eliminar este registro?"
            }
            loading={eliminando}
          />
    
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Notas</h1>
              <p className="text-gray-600 mt-2">
                Total: <span className="font-semibold">{notas.length}</span> notas registradas
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Link to="/notas/crear">
                <button className="flex items-center px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Nueva Nota
                </button>
              </Link>
            </div>
          </div>
    
          {/* Tabla de notas */}
          {notas.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
              <div className="mb-6">
                <div className="inline-block p-4 bg-gray-100 rounded-full">
                  <span className="text-gray-400 text-3xl">👨‍🎓</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay notas registradas</h3>
              <p className="text-gray-500 mb-6">Comienza agregando la primera nota al sistema</p>
              <Link to="/notas/crear">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Crear Primera Nota
                </button>
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha Registro
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  
                  <tbody className="bg-white divide-y divide-gray-200">
                    {notas.map((nota) => (
                      <tr 
                        key={nota.id} 
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono text-gray-500">#{nota.id}</span>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {nota.valor}
                            </div>
                            
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-900 truncate max-w-xs">
                              {nota.fechaRegistro}
                            </div>
                            
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                           
                          <Link to={`/notas/alumno/${nota.alumnoId}`}>
                          <button 
                            className="px-3 py-1.5 text-sm bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors font-medium flex items-center"
                            title="Ver detalles"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Ver
                          </button>
                        </Link>
                            
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pie de tabla */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                    Mostrando <span className="font-semibold">{notas.length}</span> notas
                  </div>
                  <div className="text-sm text-gray-600">
                    Haz clic en los botones de acción para gestionar cada nota
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
  );
}
