import { useState } from "react";
import Button from "../../../Elements/Button";
import Modal from "../../../Elements/Modal";
import Input from "../../../Elements/Input";
import supabase from "../../../../../supabaseClient";
import { useNavigate } from "react-router";
import { showConfirmation, showSuccess, showError } from "../../../Elements/Alert";

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
}) => {
  return (
    <div className="mb-4">
      <label className="block font-medium mb-1 text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border focus:border-soft-orange px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-[var(--color-soft-orange)]"
        required={required}
      >
        <option value="">-- Pilih {label} --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

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
      rt: user.address.rtRw?.split("/")[0]?.trim()?.replace("RT", "").trim() || "",
      rw: user.address.rtRw?.split("/")[1]?.trim()?.replace("RW", "").trim() || "",
      kelurahan: user.address.kelurahan,
      kecamatan: user.address.kecamatan,
    },
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      if (addressField === "rt" || addressField === "rw") {
        // Restrict RT and RW to numbers only
        if (value === "" || /^\d*$/.test(value)) {
          setFormData({
            ...formData,
            address: {
              ...formData.address,
              [addressField]: value,
            },
          });
        }
      } else {
        setFormData({
          ...formData,
          address: {
            ...formData.address,
            [addressField]: value,
          },
        });
      }
    } else if (name === "nik") {
      // Restrict NIK to numbers only
      if (/^\d*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    const {
      fullName,
      email,
      nik,
      birthDate,
      gender,
      address: { rt, rw, kelurahan, kecamatan },
    } = formData;

    // Validate RT and RW
    if ((rt || rw) && (!/^\d+$/.test(rt) || !/^\d+$/.test(rw))) {
      showError({
        title: "Gagal",
        text: "RT dan RW harus berupa angka.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) {
        showError({
          title: "Gagal",
          text: "User tidak login.",
          confirmButtonColor: "#d33",
        });
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
          rt: rt || null,
          rw: rw || null,
          kelurahan,
          kecamatan,
        })
        .eq("id", currentUser.id);

      if (error) {
        showError({
          title: "Gagal",
          text: `Gagal memperbarui profil: ${error.message}`,
          confirmButtonColor: "#d33",
        });
        return;
      }

      await refreshUser();

      showSuccess({
        title: "Berhasil!",
        text: "Profil berhasil diperbarui!",
        confirmButtonColor: "#52BA5E",
      });
      setIsEditModalOpen(false);
      navigate("/profile");
    } catch (err) {
      showError({
        title: "Gagal",
        text: `Terjadi kesalahan tak terduga: ${err.message}`,
        confirmButtonColor: "#d33",
      });
    }
  };

  const handlePasswordSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      showError({
        title: "Gagal",
        text: "Password baru dan konfirmasi tidak cocok.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        showError({
          title: "Gagal",
          text: "Tidak ada pengguna yang sedang login.",
          confirmButtonColor: "#d33",
        });
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        showError({
          title: "Gagal",
          text: "Password saat ini salah.",
          confirmButtonColor: "#d33",
        });
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        showError({
          title: "Gagal",
          text: `Gagal mengubah password: ${updateError.message}`,
          confirmButtonColor: "#d33",
        });
        return;
      }

      showSuccess({
        title: "Berhasil!",
        text: "Password berhasil diubah.",
        confirmButtonColor: "#52BA5E",
      });
      setIsPasswordModalOpen(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      showError({
        title: "Gagal",
        text: `Terjadi kesalahan tak terduga: ${err.message}`,
        confirmButtonColor: "#d33",
      });
    }
  };

  const genderOptions = ["Laki-Laki", "Perempuan"];

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
          <Button onClick={() => setIsPasswordModalOpen(true)}>
            Ubah password
          </Button>
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
            <Button onClick={handleEditSubmit}>Simpan Perubahan</Button>
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
              type="number"
              value={formData.nik}
              onChange={handleInputChange}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
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
            <Select
              label="Jenis Kelamin"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              options={genderOptions}
              required
            />
            <div className="flex items-center gap-2">
              <Input
                label="RT"
                name="address.rt"
                type="number"
                value={formData.address.rt}
                onChange={handleInputChange}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                className="w-1/2"
              />
              <span className="text-gray-700 text-lg">/</span>
              <Input
                label="RW"
                name="address.rw"
                type="number"
                value={formData.address.rw}
                onChange={handleInputChange}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                className="w-1/2"
              />
            </div>
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