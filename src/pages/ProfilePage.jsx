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

  return (
    <div className="flex">
      <Sidebar onSelect={setView} currentView={view} />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen font-primary">
        <h2 className="text-2xl font-bold text-[var(--color-soft-chocolate)] mb-4">
          {titleMap[view]}
        </h2>
        
        {view === "profile" && <ProfileCard user={mockUser} />}
        {view === "privacy" && <PrivacyPolicy />}
        {view === "terms" && <Terms />}
        {view === "report" && <ReportForm />}
        {view === "complaints" && <ComplaintsList />}
      </main>
    </div>
  );
};

export default ProfilePage;
