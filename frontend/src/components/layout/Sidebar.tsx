import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Sessao", to: "/" },
  { label: "Resumo", to: "/summary/default" },
  { label: "S-params", to: "/sparameters/default" },
  { label: "Radiacao", to: "/radiation/default" },
  { label: "Videos", to: "/simulations/default" },\n  { label: "Datasheet", to: "/datasheet/default" }
];

export default function Sidebar() {
  return (
    <aside className="w-60 bg-slate-900/70 border-r border-slate-800 p-4 space-y-4">
      <div>
        <p className="text-lg font-bold">HFSS Control</p>
        <p className="text-xs text-slate-400">PyAEDT + React</p>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg ${isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

