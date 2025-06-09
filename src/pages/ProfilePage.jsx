import ProfileCard from "../components/Fragments/user/profile/ProfileCard";
import PrivacyPolicy from "../components/Fragments/user/profile/PrivacyPolicy";
import Sidebar from "../components/Fragments/Sidebar";
import Terms from "../components/Fragments/user/profile/Terms";
import ComplaintsList from "../components/Fragments/user/profile/ComplaintsList";
import ReportForm from "../components/Fragments/user/profile/ReportForm";
import { FiUser, FiShield, FiBookOpen, FiMessageCircle, FiAlertCircle } from "react-icons/fi";
import { useState, useEffect } from "react";
import supabase from '../../supabaseClient'



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
  const [userData, setUserData] = useState(null);      // ⬅ real profile
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  // ──────────────────────────────────────────────────────────────────────────
  // 1. Fetch profile once after mount
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      // 1‑a  get the signed‑in user (returns null if not signed in)
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }
      if (!user) {
        setError("No active session");
        setLoading(false);
        return;
      }

      // 2‑a  query by the *primary‑key id* (== auth UID)
      //      The table is called public.user, but you can just write "user"
      const { data, error } = await supabase
        .from("user")
        .select(
          `id,
           username,
           nik,
           gender,
           kelurahan,
           email,
           tanggal_lahir,
           rt,
           rw,
           kecamatan,
           role`
        )
        .eq("id", user.id)      // <-- safest, always unique
        .single();              // we expect exactly one row

      if (error) {
        setError(error.message);
      } else {
        setUserData({
          avatar:
            user.user_metadata?.avatar_url ??
            "https://thumbs.dreamstime.com/b/default-profile-picture-avatar-photo-placeholder-vector-illustration-default-profile-picture-avatar-photo-placeholder-vector-189495158.jpg",
          fullName: data.username ?? "(Tanpa Nama)",
          email: data.email,
          nik: data.nik,
          birthDate: data.tanggal_lahir,
          gender: data.gender,
          address: {
            rtRw: `RT ${data.rt} / RW ${data.rw}`,
            kelurahan: data.kelurahan,
            kecamatan: data.kecamatan,
          },
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);


  const renderContent = () => {
    if (loading) return <p>Memuat…</p>;
    if (error)   return <p className="text-red-600">Error: {error}</p>;

    switch (view) {
      case "profile":
        return <ProfileCard user={userData} />; // <-- real data
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
        title="LaporinAja"
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
