import { useState } from "react";
import ProfileCard from "../components/Fragments/ProfileCard";
import PrivacyPolicy from "../components/Fragments/PrivacyPolicy";
import Sidebar from "../components/Layouts/Sidebar";
import Terms from "../components/Fragments/Terms";
import ComplaintsList from "../components/Fragments/ComplaintsList";
import ReportForm from "../components/Fragments/ReportForm";

const mockUser = {
  avatar: "https://thumbs.dreamstime.com/b/default-profile-picture-avatar-photo-placeholder-vector-illustration-default-profile-picture-avatar-photo-placeholder-vector-189495158.jpg",
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

const ProfilePage = () => {
  const [view, setView] = useState("profile");

  const titleMap = {
    profile: "Profil Anda",
    privacy: "Kebijakan Privasi",
    terms: "Ketentuan Pengguna",
    report: "Ajukan Keluhan",
    complaints: "Daftar Keluhan",
  };

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
      {/* Sidebar tetap di sisi kiri */}
      <div className="fixed top-0 left-0 w-64 h-screen">
        <Sidebar onSelect={setView} currentView={view} />
      </div>

      {/* Konten utama */}
      <main className="flex-1 ml-64 p-6 bg-gray-50 h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold text-[var(--color-soft-chocolate)] mb-4">
          {titleMap[view]}
        </h2>
        <div className="pb-10">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
