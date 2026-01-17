import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import MateriasPage from "./pages/MateriasPage";
import CrearMateriaPage from "./pages/CrearMateriaPage";
import AlumnosPage from "./pages/AlumnosPage";
import NotasPage from "./pages/NotasPage";
import CrearAlumnoPage from "./pages/CrearAlumnoPage";
import CrearNotasPage from "./pages/CrearNotasPage";
import AlumnoDetallePage from "./pages/AlumnoDetallePage";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/materias" />} />
        <Route path="/materias" element={<MateriasPage />} />
        <Route path="/materias/crear" element={<CrearMateriaPage />} />
        <Route path="/materias/editar/:id" element={<CrearMateriaPage />} />
        <Route path="/alumnos" element={<AlumnosPage />} />
        <Route path="/alumnos/crear" element={<CrearAlumnoPage />} />
         <Route path="/alumnos/editar/:id" element={<CrearAlumnoPage />} />
        <Route path="/notas" element={<NotasPage />} />
        <Route path="/notas/crear" element={<CrearNotasPage/>} />
        <Route path="/notas/alumno/:id" element={<AlumnoDetallePage />} />
      </Routes>
    </BrowserRouter>
  );
}
