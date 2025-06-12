import { useState } from "react";
import Modal from "../../Elements/Modal";
import { FiUser, FiArrowRight } from "react-icons/fi";
import Button from "../../Elements/Button";
import { showConfirmation, showSuccess } from "../../Elements/Alert";

const Users = () => {
  const [userData, setUserData] = useState([
    {
      name: "UID1234",
      address: "Jl. Lorem Ipsum, Kec. Dolor, Kec. Sit Amet",
      complaints: [
        "Jalan berlubang di Jl. Diponegoro",
        "Lampu jalan mati di Jl. Kartini",
      ],
    },
    {
      name: "UID1235",
      address: "Jl. Lorem Ipsum, Kec. Dolor, Kec. Sit Amet",
      complaints: ["Sampah menumpuk di Jl. Sisingamangaraja"],
    },
    {
      name: "UID1236",
      address: "Jl. Lorem Ipsum, Kec. Dolor, Kec. Sit Amet",
      complaints: ["Trotoar rusak dekat SMA 1"],
    },
    {
      name: "UID1237",
      address: "Jl. Lorem Ipsum, Kec. Dolor, Kec. Sit Amet",
      complaints: ["Trotoar rusak dekat SMA 1"],
    },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = (userName) => {
    showConfirmation({
      title: "Konfirmasi Hapus Pengguna",
      text: `Apakah Anda yakin ingin menghapus pengguna "${userName}"?`,
      confirmButtonText: "Hapus",
    }).then((result) => {
      if (result.isConfirmed) {
        setUserData(userData.filter((user) => user.name !== userName));
        if (selectedUser?.name === userName) {
          closeModal();
        }
        showSuccess({
          title: "Berhasil!",
          text: `Pengguna "${userName}" telah dihapus.`,
        });
      }
    });
  };

  // Pagination logic
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
          className={`px-3 py-1 rounded-full ${
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
      {/* Label kolom atas */}
      <div className="flex justify-between items-center text-sm sm:text-base font-semibold text-gray-600 border-b border-gray-200 pb-2">
        <span>Username</span>
        <span>Domisili</span>
      </div>

      {/* List User */}
      <div className="w-full space-y-4">
        {currentUsers.map((user, index) => (
          <div
            key={index}
            onClick={() => openModal(user)}
            className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition-all duration-200 cursor-pointer px-5 py-4 group"
          >
            <div className="flex justify-between items-center flex-col sm:flex-row">
              <div className="flex items-center gap-3">
                <FiUser className="w-8 h-8 text-gray-500 group-hover:text-gray-700 transition" />
                <div className="text-gray-500 font-medium">{user.name}</div>
              </div>
              <div className="text-center sm:text-right mt-1 sm:mt-0">
                <div className="text-sm text-gray-600">{user.address}</div>
                <div className="text-sm mt-1 inline-block bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                  {user.complaints.length} keluhan
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {userData.length > usersPerPage && (
        <div className="flex justify-center mt-4 space-x-2 items-center">
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-soft-orange/20 cursor-pointer"
          >
            Previous
          </button>
          {renderPageNumbers()}
          <button
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-soft-orange/20 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal Detail */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={`Profil ${selectedUser?.name}`}
        className="w-full max-w-lg mx-4 sm:mx-6 md:mx-8"
        maxHeight="80vh"
        footer={
          <div className="flex justify-end gap-3">
            <Button onClick={closeModal} color="red">
              Batal
            </Button>
            <Button onClick={() => handleDelete(selectedUser?.name)}>
              Hapus Pengguna
            </Button>
          </div>
        }
      >
        {selectedUser && (
          <div className="text-gray-700 space-y-4 text-sm md:text-base">
            <div>
              <p className="font-semibold">Nama:</p>
              <p>{selectedUser.name}</p>
            </div>
            <div>
              <p className="font-semibold">Alamat:</p>
              <p>{selectedUser.address}</p>
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