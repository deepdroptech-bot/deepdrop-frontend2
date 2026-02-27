import { NavLink } from "react-router-dom";
import { navItems } from "../../config/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user } = useAuth();

  const filteredNavItems = navItems.filter(item =>
    item.roles?.includes(user?.role)
  );

  return (
    <aside
      className={`
        hidden md:flex flex-col fixed top-0 left-0 h-screen
        ${collapsed ? "w-20" : "w-64"}
        transition-all duration-300
        bg-gradient-to-b from-red-600 via-blue-700 to-blue-900
        text-white shadow-2xl
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <h1 className="font-bold text-lg tracking-wide">
            DeepDrop Energy
          </h1>
        )}
        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 mt-6 space-y-2 px-2">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-xl transition-all
               ${isActive
                 ? "bg-white text-blue-700 font-semibold"
                 : "hover:bg-white/20"}`
            }
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}