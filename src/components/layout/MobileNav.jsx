import { NavLink } from "react-router-dom";
import { navItems } from "../../config/navigation";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef, useState } from "react";

export default function MobileNav() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  const filteredNavItems = navItems.filter(item =>
    item.roles?.includes(user?.role)
  );

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const threshold = 10;

      // ignore tiny scrolls
      if (Math.abs(currentScrollY - lastScrollY.current) < threshold) return;

      if (currentScrollY > lastScrollY.current) {
        setVisible(false); // scrolling down
      } else {
        setVisible(true); // scrolling up
      }

      // ALWAYS update ref
      lastScrollY.current = currentScrollY;

      // safety: always show near top
      if (currentScrollY < 50) {
        setVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
  <div
    className={`
      md:hidden fixed bottom-0 left-0 right-0
      bg-white border-t border-blue-100 shadow-2xl
      z-50 transition-transform duration-300
      ${visible ? "translate-y-0" : "translate-y-full"}
    `}
  >
    <div
      className="
        flex overflow-x-auto no-scrollbar
        snap-x snap-mandatory
        px-1 py-2
      "
    >
      {filteredNavItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `
            flex-shrink-0 w-1/4 snap-start
            flex flex-col items-center justify-center
            gap-1 py-2 rounded-xl transition-all duration-200
            ${
              isActive
                ? "text-blue-700 bg-blue-50"
                : "text-gray-500 hover:text-blue-600"
            }
            `
          }
        >
          <item.icon size={20} />
          <span className="text-[10px] font-medium truncate">
            {item.name}
          </span>
        </NavLink>
      ))}
    </div>
  </div>
);
}