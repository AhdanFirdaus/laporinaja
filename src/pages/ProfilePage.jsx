import ProfileCard from "../components/Fragments/ProfileCard";
import PrivacyPolicy from "../components/Fragments/PrivacyPolicy";
import Sidebar from "../components/Layouts/Sidebar";
import Terms from "../components/Fragments/Terms";
import ComplaintsList from "../components/Fragments/ComplaintsList";
import ReportForm from "../components/Fragments/ReportForm";
import { FiUser, FiShield, FiBookOpen, FiMessageCircle, FiAlertCircle } from "react-icons/fi";
import { useState } from "react";

const mockUser = {
  avatar:
    "https://thumbs.dreamstime.com/b/default-profile-picture-avatar-photo-placeholder-vector-illustration-default-profile-picture-avatar-photo-placeholder-vector-189495158.jpg",
  fullName: "Jessica James",
  email: "jessica_jones@mail.com",
  nik: "1234567890123456",
  birthDate: "04/02/1991",
  gender: "Perempuan",
  address: {
    rtRw: "RT 05 / RW 12",
    kelurahan: "Kelurahan Sukamaju",
    kecamatan: "Kecamatan Mandalika",
  },
};

// Menu items for the Sidebar
  const menuItems = [
    { key: "profile", icon: <FiUser />, label: "Profil" },
    { key: "privacy", icon: <FiShield />, label: "Kebijakan Privasi" },
    { key: "terms", icon: <FiBookOpen />, label: "Ketentuan" },
    { key: "report", icon: <FiMessageCircle />, label: "Ajukan Keluhan" },
    { key: "complaints", icon: <FiAlertCircle />, label: "Keluhan" },
  ];

const titleMap = {
  profile: "Profil Anda",
  privacy: "Kebijakan Privasi",
  terms: "Ketentuan Pengguna",
  report: "Ajukan Keluhan",
  complaints: "Daftar Keluhan",
};

const ProfilePage = () => {
  const [view, setView] = useState("profile");

  const renderContent = () => {
    switch (view) {
      case "profile":
        return <ProfileCard user={mockUser} />;
      case "privacy":
        return <PrivacyPolicy />;
      case "terms":
        return <Terms />;
      case "report":
        return <ReportForm />;
      case "complaints":
        return <ComplaintsList />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        title="LaporinAja."
        menuItems={menuItems}
        currentView={view}
        onSelect={setView}
        showLogout={true}
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

export default ProfilePage;
