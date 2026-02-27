import { useState } from "react";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import { Link } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

export default function DashboardLayout({ children }) {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-blue-50">

      <div className="flex">

        {/* Sidebar */}
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Main Section */}
        <div
          className={`
            flex-1 flex flex-col min-h-screen transition-all duration-300
            ${collapsed ? "md:ml-20" : "md:ml-64"}
          `}
        >
          {/* Topbar */}
          <header className="bg-white shadow-sm border-b border-blue-100 p-4 flex justify-between items-center">

            <h2 className="text-blue-800 font-semibold text-lg">
              Welcome back{user?.role ? `, ${user.role}` : ""}
            </h2>

            <Link
              to="/dashboard/myprofile"
              className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition"
            >
              <UserCircleIcon className="w-8 h-8" />
            </Link>
          </header>

          {/* Content */}
          <main className="flex-1 p-6 pb-24 md:pb-20">
            {children}
          </main>

        </div>

        {/* Mobile Nav */}
        <MobileNav />
      </div>

      {/* Desktop Fixed Footer */}
      <footer
        className={`
          hidden md:block fixed bottom-0
          ${collapsed ? "left-20" : "left-64"}
          right-0
          bg-white shadow-inner border-t border-blue-100
          p-4 text-center text-sm text-gray-500
          transition-all duration-300
        `}
      >
        &copy; {new Date().getFullYear()} DeepDrop Energy Tech™. All rights reserved.
      </footer>

    </div>
  );
}

