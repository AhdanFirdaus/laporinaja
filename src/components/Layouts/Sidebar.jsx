import {
  FaShieldAlt,
  FaFileContract,
  FaBullhorn,
  FaExclamationCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";

const Sidebar = ({ onSelect, currentView }) => {
  const menuItems = [
    { key: "profile", icon: <FaCircleUser />, label: "Profil" },
    { key: "privacy", icon: <FaShieldAlt />, label: "Kebijakan Privasi" },
    { key: "terms", icon: <FaFileContract />, label: "Ketentuan Pengguna" },
    { key: "complain", icon: <FaBullhorn />, label: "Ajukan Keluhan" },
    { key: "complaints", icon: <FaExclamationCircle />, label: "Keluhan" },
  ];

  return (
    <aside className="w-64 bg-white h-screen p-6 shadow-md flex flex-col justify-between">
      <div>
        <h1 className="text-4xl font-bold text-soft-orange my-5 mb-20">LaporAja.</h1>
        <nav className="space-y-4">
          {menuItems.map((item) => (
            <div
              key={item.key}
              onClick={() => onSelect(item.key)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all
                ${
                  currentView === item.key
                    ? "bg-soft-chocolate text-white"
                    : "text-gray-700 hover:bg-soft-chocolate hover:text-white"
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 text-red-600 border border-red-500 bg-red-100 hover:bg-red-500 hover:text-white px-3 py-3 rounded-lg cursor-pointer transition-all">
          <FaSignOutAlt />
          <span>Sign Out</span>
        </div>
        <div className="text-sm text-gray-400 text-center">© 2025 LaporAja.</div>
      </div>
    </aside>
  );
};

export default Sidebar;
