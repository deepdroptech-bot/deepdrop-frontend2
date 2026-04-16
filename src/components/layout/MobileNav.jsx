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
      flex overflow-x-auto py-2 z-50
      transition-transform duration-300
      ${visible ? "translate-y-0" : "translate-y-full"}
      `}
    >
      <div className="
  flex overflow-x-auto snap-x snap-mandatory no-scrollbar
">
      {filteredNavItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center
            w-1/4 flex-shrink-0 text-xs snap-start
            ${isActive ? "text-blue-700" : "text-gray-500"}`
          }
        >
          <item.icon size={20} />
          <span className="text-[10px]">{item.name}</span>
        </NavLink>
      ))}
    </div>
    </div>
  );
}