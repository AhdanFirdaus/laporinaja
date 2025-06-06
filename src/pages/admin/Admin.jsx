import { useState } from "react";
import Sidebar from "../../components/Layouts/Sidebar";
import { FiAlertCircle, FiHome, FiUsers } from "react-icons/fi";
import Dashboard from "../../components/Fragments/admin/Dashboard";
import Complaints from "../../components/Fragments/admin/Complaints";
import Users from "../../components/Fragments/admin/Users";

const menuItems = [
  { key: "dashboard", icon: <FiHome />, label: "Dashboard" },
  { key: "complaints", icon: <FiAlertCircle />, label: "Keluhan" },
  { key: "users", icon: <FiUsers />, label: "Pengguna" },
];

const titleMap = {
  dashboard: "Dashboard Admin",
  complaints: "Keluhan Pengguna",
  users: "Daftar Pengguna",
};

const Admin = () => {
  const [view, setView] = useState("dashboard");

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  const renderContent = () => {
    switch (view) {
      case "dashboard":
        return <Dashboard />;
      case "complaints":
        return <Complaints />;
      case "users":
        return <Users />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        title="Admin Panel"
        menuItems={menuItems}
        currentView={view}
        onSelect={setView}
        showLogout={true}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <main
        className={`flex-1 p-6 bg-gray-50 overflow-y-auto transition-all duration-300 ml-16 md:ml-64`}
      >
        <h2 className="text-3xl font-bold font-second text-soft-orange mb-4">
          {titleMap[view]}
        </h2>
        <div className="pb-10">{renderContent()}</div>
      </main>
    </div>
  );
};

export default Admin;
