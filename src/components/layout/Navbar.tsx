import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <nav className="flex flex-wrap gap-4">
          <NavItem to="/materias" label="Materias" />
          <NavItem to="/alumnos" label="Alumnos" />
          <NavItem to="/notas" label="Notas" />
        </nav>
      </div>
    </header>
  );
}

interface NavItemProps {
  to: string;
  label: string;
}

function NavItem({ to, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        px-5 py-2 rounded-lg text-sm font-medium
        transition-all duration-200
        ${
          isActive
            ? "bg-blue-600 text-white shadow"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }
      `
      }
    >
      {label}
    </NavLink>
  );
}
