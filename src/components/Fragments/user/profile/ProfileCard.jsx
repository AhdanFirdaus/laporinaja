import { useState } from 'react';
import Button from "../../../Elements/Button";
import Modal from "../../../Elements/Modal";
import Input from "../../../Elements/Input";
import supabase from "../../../../../supabaseClient";
import { useNavigate } from 'react-router';

const ProfileCard = ({ user, refreshUser }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    nik: user.nik,
    birthDate: user.birthDate,
    gender: user.gender,
    address: {
      rtRw: user.address.rtRw,
      kelurahan: user.address.kelurahan,
      kecamatan: user.address.kecamatan,
    },
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, nik, birthDate, gender, address: { rtRw, kelurahan, kecamatan } } = formData;

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        alert("User tidak login.");
        return;
      }

      const { error } = await supabase
        .from("user")
        .update({
          username: fullName,
          email,
          nik,
          tanggal_lahir: birthDate,
          gender,
          rt: rtRw?.split("/")[0]?.trim()?.replace("RT", "").trim(),
          rw: rtRw?.split("/")[1]?.trim()?.replace("RW", "").trim(),
          kelurahan,
          kecamatan,
        })
        .eq("id", currentUser.id);

      if (error) {
        alert("Gagal memperbarui profil: " + error.message);
        return;
      }

      // Call refreshUser to update parent state
      await refreshUser();

      alert("Profil berhasil diperbarui!");
      setIsEditModalOpen(false);
      navigate("/profile");
    } catch (err) {
      alert("Terjadi kesalahan tak terduga: " + err.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      alert("Password baru dan konfirmasi tidak cocok.");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Tidak ada pengguna yang sedang login.");
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        alert("Password saat ini salah.");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        alert("Gagal mengubah password: " + updateError.message);
        return;
      }

      alert("Password berhasil diubah.");
      setIsPasswordModalOpen(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      alert("Terjadi kesalahan tak terduga: " + err.message);
    }
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 p-6 md:p-8 bg-white rounded-lg shadow-md">
      <div className="flex flex-col lg:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
        <div className="flex items-center gap-4 md:gap-6 flex-col md:flex-row mx-auto md:mx-0">
          <img
            src={user.avatar}
            alt="Profile"
            className="w-16 h-16 md:w-24 md:h-24 rounded-full md:rounded-md"
          />
          <div>
            <p className="text-lg md:text-xl text-center md:text-start font-bold">
              {user.fullName}
            </p>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">
              {user.email}
            </p>
          </div>
        </div>
        <div className="flex gap-2 mx-auto md:mx-0 flex-col sm:flex-row">
          <Button onClick={() => setIsEditModalOpen(true)}>Edit profile</Button>
          <Button onClick={() => setIsPasswordModalOpen(true)}>Ubah password</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm text-gray-700">
        <div>
          <p className="font-semibold uppercase">NIK</p>
          <p>{user.nik}</p>
        </div>
        <div>
          <p className="font-semibold uppercase">Tanggal Lahir</p>
          <p>{user.birthDate}</p>
        </div>
        <div>
          <p className="font-semibold uppercase">Jenis Kelamin</p>
          <p>{user.gender}</p>
        </div>
        <div>
          <p className="font-semibold uppercase">Alamat</p>
          <p>
            {user.address.rtRw}, {user.address.kelurahan},{" "}
            {user.address.kecamatan}
          </p>
        </div>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
        className="w-full max-w-4xl mx-4 sm:mx-6 md:mx-8"
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsEditModalOpen(false)} color="red">
              Batal
            </Button>
            <Button onClick={handleEditSubmit} color="blue">
              Simpan Perubahan
            </Button>
          </div>
        }
      >
        <form onSubmit={handleEditSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nama Lengkap"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <Input
              label="NIK"
              name="nik"
              value={formData.nik}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Tanggal Lahir"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Jenis Kelamin"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            />
            <Input
              label="RT/RW"
              name="address.rtRw"
              value={formData.address.rtRw}
              onChange={handleInputChange}
            />
            <Input
              label="Kelurahan"
              name="address.kelurahan"
              value={formData.address.kelurahan}
              onChange={handleInputChange}
            />
            <Input
              label="Kecamatan"
              name="address.kecamatan"
              value={formData.address.kecamatan}
              onChange={handleInputChange}
            />
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Ubah Password"
        className="w-full max-w-md mx-4 sm:mx-6 md:mx-8"
        maxHeight="80vh"
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsPasswordModalOpen(false)} color="red">
              Batal
            </Button>
            <Button onClick={handlePasswordSubmit} color="blue">
              Simpan Password
            </Button>
          </div>
        }
      >
        <form onSubmit={handlePasswordSubmit}>
          <div className="flex flex-col gap-4">
            <Input
              label="Password saat ini"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
            <Input
              label="Password Baru"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
            <Input
              label="Konfirmasi password baru"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfileCard;