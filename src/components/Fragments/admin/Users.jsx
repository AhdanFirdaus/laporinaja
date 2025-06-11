import { useState, useEffect } from "react";
import Modal from "../../Elements/Modal";
import { FiUser, FiArrowRight } from "react-icons/fi";
import Button from "../../Elements/Button";
import { showConfirmation, showSuccess } from "../../Elements/Alert";
import supabase from "../../../../supabaseClient";

const Users = () => {
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch users
        const { data: users, error: userError } = await supabase
          .from("user")
          .select("id, username, kecamatan");

        if (userError) {
          console.error("Error fetching users:", userError);
          return;
        }

        // Fetch complaints for all users
        const { data: complaints, error: complaintError } = await supabase
          .from("keluhan")
          .select("user_id, title");

        if (complaintError) {
          console.error("Error fetching complaints:", complaintError);
          return;
        }

        // Map users with their complaints
        const usersWithComplaints = users.map(user => ({
          id: user.id,
          username: user.username,
          kecamatan: user.kecamatan,
          complaints: complaints
            .filter(complaint => complaint.user_id === user.id)
            .map(complaint => complaint.title)
        }));

        setUserData(usersWithComplaints);
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchUsers();
  }, []);

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = (username) => {
    showConfirmation({
      title: "Konfirmasi Hapus Pengguna",
      text: `Apakah Anda yakin ingin menghapus pengguna "${username}"?`,
      confirmButtonText: "Hapus",
    }).then((result) => {
      if (result.isConfirmed) {
        setUserData(userData.filter((user) => user.username !== username));
        if (selectedUser?.username === username) {
          closeModal();
        }
        showSuccess({
          title: "Berhasil!",
          text: `Pengguna "${username}" telah dihapus.`,
        });
      }
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Label kolom atas */}
      <div className="flex justify-between items-center text-sm sm:text-base font-semibold text-gray-600 border-b border-gray-200 pb-2">
        <span>Username</span>
        <span>Domisili</span>
      </div>

      {/* List User */}
      <div className="w-full space-y-4">
        {userData.map((user, index) => (
          <div
            key={index}
            onClick={() => openModal(user)}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer px-5 py-4 group"
          >
            <div className="flex justify-between items-center flex-col sm:flex-row">
              <div className="flex items-center gap-3">
                <FiUser className="w-8 h-8 text-gray-500 group-hover:text-black transition" />
                <div className="text-gray-800 font-medium">{user.username}</div>
              </div>
              <div className="text-center sm:text-right mt-1 sm:mt-0">
                <div className="text-sm text-gray-600">{user.kecamatan}</div>
                <div className="text-sm mt-1 inline-block bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {user.complaints.length} keluhan
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={`Profil ${selectedUser?.username}`}
        className="w-full max-w-lg mx-4 sm:mx-6 md:mx-8"
        maxHeight="80vh"
        footer={
          <div className="flex justify-end gap-3">
            <Button onClick={closeModal} color="red">
              Batal
            </Button>
            <Button onClick={() => handleDelete(selectedUser?.username)}>
              Hapus Pengguna
            </Button>
          </div>
        }
      >
        {selectedUser && (
          <div className="text-gray-700 space-y-4 text-sm md:text-base">
            <div>
              <p className="font-semibold">Nama:</p>
              <p>{selectedUser.username}</p>
            </div>
            <div>
              <p className="font-semibold">Domisili:</p>
              <p>{selectedUser.kecamatan}</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Keluhan:</p>
              <div className="space-y-2">
                {selectedUser.complaints.map((comp, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 group text-gray-700"
                  >
                    <span className="text-lg leading-none">•</span>
                    <span className="truncate hover:underline cursor-pointer">
                      {comp}
                    </span>
                    <FiArrowRight
                      size={14}
                      className="transform transition-transform duration-200 group-hover:-rotate-45"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Users;