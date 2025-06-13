import ProfileCard from "../components/Fragments/user/profile/ProfileCard";
import PrivacyPolicy from "../components/Fragments/user/profile/PrivacyPolicy";
import Sidebar from "../components/Fragments/Sidebar";
import Terms from "../components/Fragments/user/profile/Terms";
import ComplaintsList from "../components/Fragments/user/profile/ComplaintsList";
import ReportForm from "../components/Fragments/user/profile/ReportForm";
import {
  FiUser,
  FiShield,
  FiBookOpen,
  FiMessageCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import supabase from "../../supabaseClient";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

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
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    setLoading(true);
    try {
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

      const { data, error } = await supabase
        .from("user")
        .select(
          `id, username, nik, gender, kelurahan, email, tanggal_lahir, rt, rw, kecamatan, role`
        )
        .eq("id", user.id)
        .single();

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
    } catch (err) {
      setError("Unexpected error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login");
      }

      if (session.user.id === "0340bc90-20c4-40c4-828c-6b89b8924d8d") {
        navigate("/admin");
      }
    };
    checkSession();
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Logout Gagal",
        text: error.message,
      });
      return;
    }
    navigate("/login");
  };

  const renderContent = () => {
    if (loading) return <p>Memuat…</p>;
    if (error) return <p className="text-red-600">Error: {error}</p>;

    switch (view) {
      case "profile":
        return <ProfileCard user={userData} refreshUser={refreshUser} />;
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
      <Sidebar
        title="LaporinAja"
        menuItems={menuItems}
        currentView={view}
        onSelect={setView}
        showLogout={true}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto transition-all duration-300 ml-16 md:ml-64">
        <h2 className="text-3xl font-bold font-second text-soft-orange mb-4">
          {titleMap[view]}
        </h2>
        <div className="pb-10">{renderContent()}</div>
      </main>
    </div>
  );
};

export default ProfilePage;
