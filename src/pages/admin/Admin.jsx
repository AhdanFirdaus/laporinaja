import { useState, useEffect } from "react";
import Sidebar from "../../components/Fragments/Sidebar";
import { FiAlertCircle, FiHome, FiUsers } from "react-icons/fi";
import Dashboard from "../../components/Fragments/admin/Dashboard";
import Complaints from "../../components/Fragments/admin/Complaints";
import Users from "../../components/Fragments/admin/Users";
import { useNavigate } from "react-router";
import supabase from "../../../supabaseClient";

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
  const [autoOpenComplaintId, setAutoOpenComplaintId] = useState(null);
  const navigate = useNavigate(); 

  const handleEachModal = (id) => {
    setAutoOpenComplaintId(id);
    setView("complaints");
  };

  

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Gagal logout:", error.message);
      return;
    }
    navigate("/login");
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login")
      }

      if (session.user.id !== "0340bc90-20c4-40c4-828c-6b89b8924d8d") {
        navigate("/profile");
      }
    };
    checkSession()
  }, []);

  const renderContent = () => {
    switch (view) {
      case "dashboard":
        return <Dashboard setView={setView} />; 
      case "complaints":
        return <Complaints
          autoOpenComplaintId={autoOpenComplaintId}
          clearAutoOpenId={() => setAutoOpenComplaintId(null)}
        />;
      case "users":
        return <Users setView={setView} />;
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
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto transition-all duration-300 ml-16 md:ml-64">
        <h2 className="text-3xl font-bold font-second text-soft-orange mb-4">
          {titleMap[view]}
        </h2>
        <div className="pb-10">
          {view === "dashboard" && <Dashboard setView={setView} />} {/* Changed from onNavigate to setView */}
          {view === "complaints" && <Complaints
            autoOpenComplaintId={autoOpenComplaintId}
            clearAutoOpenId={() => setAutoOpenComplaintId(null)}
          />}
          {view === "users" && <Users setView={setView} handleEachModal={handleEachModal} />}
        </div>
      </main>
    </div>
  );
};

export default Admin;