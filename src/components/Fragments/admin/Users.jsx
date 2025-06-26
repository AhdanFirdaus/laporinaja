import { useState, useEffect } from "react";
import Modal from "../../Elements/Modal";
import { FiUser, FiArrowRight } from "react-icons/fi";
import Button from "../../Elements/Button";
import { showConfirmation, showSuccess } from "../../Elements/Alert";
import supabase from "../../../../supabaseClient";

const Users = ({ setView, handleEachModal }) => {
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: users, error: userError } = await supabase
          .from("user")
          .select("id, username, kecamatan");

        if (userError) {
          Swal.fire({
            icon: "error",
            title: "Gagal Memuat User",
            text:
              userError?.message || "Terjadi kesalahan saat mengambil data user.",
            timer: 3000,
            showConfirmButton: false,
          });
          return;
        }

        const { data: complaints, error: complaintError } = await supabase
          .from("keluhan")
          .select("user_id, title,id");

        if (complaintError) {
          Swal.fire({
            icon: "error",
            title: "Gagal Memuat Laporan",
            text:
              complaintError?.message ||
              "Terjadi kesalahan saat mengambil data laporan.",
            timer: 3000,
            showConfirmButton: false,
          });
          return;
        }

        const usersWithComplaints = users.map((user) => ({
          id: user.id,
          username: user.username,
          kecamatan: user.kecamatan,
          complaints: complaints
            .filter((complaint) => complaint.user_id === user.id)
            .map((complaint) => [complaint.id, complaint.title]),
        }));

        setUserData(usersWithComplaints);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Kesalahan Tak Terduga",
          text: err?.message || "Terjadi kesalahan yang tidak diketahui.",
          timer: 3000,
          showConfirmButton: false,
        });
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

  const handleDelete = async (id) => {
    showConfirmation({
      title: "Konfirmasi Hapus Pengguna",
      text: `Apakah Anda yakin ingin menghapus pengguna "${id}"?`,
      confirmButtonText: "Hapus",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await supabase
          .from("user")
          .delete()
          .eq("id", id);

        if (error) {
          Swal.fire({
            icon: "error",
            title: "Gagal Menghapus dari Supabase",
            text: error?.message || "Terjadi kesalahan saat menghapus data.",
            timer: 3000,
            showConfirmButton: false,
          });
          showError({
            title: "Gagal!",
            text: "Pengguna tidak berhasil dihapus. Silakan coba lagi.",
          });
          return;
        }

        setUserData((prev) =>
          prev.filter((user) => user.id !== id)
        );
        if (selectedUser?.id === id) {
          closeModal();
        }

        showSuccess({
          title: "Berhasil!",
          text: `Pengguna "${id}" telah dihapus.`,
        });
      }
    });
  };

  const totalPages = Math.ceil(userData.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = userData.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-sm sm:text-base ${
            currentPage === i
              ? "bg-soft-orange text-white"
              : "bg-gray-200 text-gray-700 hover:bg-soft-orange/20 cursor-pointer"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="w-full space-y-4">
      {/* Top column label */}
      <div className="flex justify-between items-center text-xs sm:text-sm md:text-base font-semibold text-gray-600 border-b border-gray-200 pb-2">
        <span>Username</span>
        <span>Domisili</span>
      </div>

      {/* List User */}
      <div className="w-full space-y-4">
        {currentUsers.map((user, index) => (
          <div
            key={index}
            onClick={() => openModal(user)}
            className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition-all duration-200 cursor-pointer px-4 py-3 sm:px-5 sm:py-4"
          >
            <div className="flex justify-between items-center flex-col sm:flex-row gap-2 sm:gap-0">
              <div className="flex items-center gap-3">
                <FiUser className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 group-hover:text-gray-700 transition" />
                <div className="text-gray-500 font-medium text-sm sm:text-base">
                  {user.id}
                </div>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-xs sm:text-sm text-gray-600">
                  {user.kecamatan}
                </div>
                <div className="text-xs sm:text-sm mt-1 inline-block bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                  {user.complaints.length} keluhan
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {userData.length > usersPerPage && (
        <div className="flex justify-center mt-4 space-x-1 sm:space-x-2 items-center flex-wrap gap-y-2">
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-soft-orange/20 cursor-pointer text-sm sm:text-base"
          >
            Previous
          </button>
          <div className="flex space-x-1 sm:space-x-2 flex-wrap justify-center gap-y-2">
            {renderPageNumbers()}
          </div>
          <button
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-soft-orange/20 cursor-pointer text-sm sm:text-base"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal Detail */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={`Profil ${selectedUser?.id}`}
        className="w-full max-w-md sm:max-w-lg mx-4"
        maxHeight="80vh"
        footer={
          <div className="flex justify-end gap-3">
            <Button onClick={closeModal} color="red">
              Batal
            </Button>
            <Button onClick={() => handleDelete(selectedUser?.id)}>
              Hapus Pengguna
            </Button>
          </div>
        }
      >
        {selectedUser && (
          <div className="text-gray-700 space-y-4 text-sm sm:text-base">
            <div>
              <p className="font-semibold">Nama:</p>
              <p>{selectedUser.id}</p>
            </div>
            <div>
              <p className="font-semibold">Domisili:</p>
              <p>{selectedUser.kecamatan}</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Keluhan:</p>
              <div className="space-y-2">
                {selectedUser.complaints.length > 0 ? (
                  selectedUser.complaints.map(([id, title]) => (
                    <div
                      key={id}
                      className="flex items-center gap-2 group text-gray-700"
                    >
                      <span className="text-base leading-none">•</span>
                      <span
                        className="truncate hover:underline cursor-pointer text-sm sm:text-base"
                        onClick={() => handleEachModal(id)}
                      >
                        {title}
                      </span>
                      <FiArrowRight
                        size={12}
                        className="transform transition-transform duration-200 group-hover:-rotate-45"
                      />
                    </div>
                  ))
                ) : (
                  <p className="italic text-gray-500">Keluhan Masih Kosong.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Users;