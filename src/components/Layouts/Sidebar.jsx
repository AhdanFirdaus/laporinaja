import {
  FaShieldAlt,
  FaFileContract,
  FaBullhorn,
  FaExclamationCircle,
} from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white h-screen p-6 shadow-md flex flex-col justify-between">
      <div>
        <h1 className="text-4xl font-bold text-soft-orange my-5 mb-20">LaporAja.</h1>
        <nav className="space-y-4">
          <div className="flex items-center gap-3 text-gray-700 hover:bg-soft-chocolate hover:text-white px-3 py-3 rounded-lg cursor-pointer">
            <FaCircleUser />
            <span>Profil</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 hover:bg-soft-chocolate hover:text-white px-3 py-3 rounded-lg cursor-pointer">
            <FaShieldAlt />
            <span>Kebijakan Privasi</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 hover:bg-soft-chocolate hover:text-white px-3 py-3 rounded-lg cursor-pointer">
            <FaFileContract />
            <span>Ketentuan Pengguna</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 hover:bg-soft-chocolate hover:text-white px-3 py-3 rounded-lg cursor-pointer">
            <FaBullhorn />
            <span>Ajukan Keluhan</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 hover:bg-soft-chocolate hover:text-white px-3 py-3 rounded-lg cursor-pointer">
            <FaExclamationCircle />
            <span>Keluhan</span>
          </div>
        </nav>
      </div>

      {/* Sign Out Button */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-red-600 border border-red-500 bg-red-100 hover:bg-red-500 hover:text-white px-3 py-3 rounded-lg cursor-pointer transition-all">
          <FaSignOutAlt />
          <span>Sign Out</span>
        </div>
        <div className="text-sm text-gray-400 text-center">
          © 2025 LaporAja.
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;