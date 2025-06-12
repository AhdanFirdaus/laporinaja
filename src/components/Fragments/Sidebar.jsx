import { useState, useEffect } from "react";
import {
  FiX,
  FiLogOut,
  FiMenu,
  FiHome, // Added for Beranda button
} from "react-icons/fi";
import Button from "../Elements/Button";

const Sidebar = ({
  onSelect,
  currentView,
  menuItems = [],
  title = "Sidebar",
  showLogout = false,
  onLogout = () => {},
  onHome = () => {}, // New prop for Beranda button action
}) => {
  const [isOpen, setIsOpen] = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <aside
      className={`bg-white h-screen shadow-md flex flex-col justify-between transition-all duration-300
        ${isOpen ? "w-64" : "w-16"} md:w-64 p-4 md:p-6 fixed top-0 left-0 z-50`}
    >
      <div>
        <div className="flex items-center justify-center md:justify-between my-5 gap-10">
          <h1
            className={`text-4xl font-bold font-second text-center text-soft-orange
              ${isOpen ? "block" : "hidden"} md:block`}
          >
            {title}
          </h1>
          <button
            className="text-gray-700 md:hidden focus:outline-none z-50"
            onClick={toggleSidebar}
            aria-label={isOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        <nav className="space-y-4">
          {menuItems.map((item) => (
            <div
              key={item.key}
              onClick={() => {
                onSelect(item.key);
                if (window.innerWidth < 768) setIsOpen(false);
              }}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all
                ${
                  currentView === item.key
                    ? "bg-soft-orange text-white"
                    : "text-gray-700 hover:bg-soft-orange hover:text-white"
                }
                ${isOpen ? "justify-start" : "justify-center"} md:justify-start`}
            >
              <div className="text-xl">{item.icon}</div>
              <span className={`${isOpen ? "block" : "hidden"} md:block`}>
                {item.label}
              </span>
            </div>
          ))}
        </nav>
      </div>

      {showLogout && (
        <div className="space-y-6">
          <Button
            onClick={() => {
              if (window.innerWidth < 768) setIsOpen(false);
              onLogout();
            }}
            color="redoutline"
            className={`flex items-center gap-3 w-full transition-all
              ${isOpen ? "justify-start" : "justify-center"} md:justify-start`}
            rounded="rounded-lg"
            txtcolor="text-red-600"
            font="font-normal"
          >
            <div className="text-xl">
              <FiLogOut />
            </div>
            <span className={`${isOpen ? "block" : "hidden"} md:block`}>
              Sign Out
            </span>
          </Button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;