import { useState } from "react";
import Modal from "../../Elements/Modal";
import { FiUser, FiArrowRight } from "react-icons/fi";

const userData = [
  {
    name: "UID1234",
    address: "Jl. Lorem Ipsum, Kec. Dolor, Kec. Sit Amet",
    complaints: ["Jalan berlubang di Jl. Diponegoro", "Lampu jalan mati di Jl. Kartini"],
  },
  {
    name: "UID1235",
    address: "Jl. Lorem Ipsum, Kec. Dolor, Kec. Sit Amet ",
    complaints: ["Sampah menumpuk di Jl. Sisingamangaraja"],
  },
  {
    name: "UID1236",
    address: "Jl. Lorem Ipsum, Kec. Dolor, Kec. Sit Amet",
    complaints: ["Trotoar rusak dekat SMA 1"],
  },
  {
    name: "UID1236",
    address: "Jl. Lorem Ipsum, Kec. Dolor, Kec. Sit Amet",
    complaints: ["Trotoar rusak dekat SMA 1"],
  },
];

const Users = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="w-full space-y-4">
      {/* Label kolom atas */}
      <div className="flex justify-between items-center px-5 sm:px-6 md:px-8 text-sm sm:text-base font-semibold text-gray-600 border-b border-gray-200 pb-2">
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
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FiUser className="w-8 h-8 text-gray-500 group-hover:text-black transition" />
                <div className="text-gray-800 font-medium">{user.name}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">{user.address}</div>
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
        title={`Profil ${selectedUser?.name}`}
        className="w-full max-w-lg mx-4 sm:mx-6 md:mx-8"
        maxHeight="80vh"
        footer={
          <div className="flex justify-end">
            <button
              onClick={closeModal}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded"
            >
              Tutup
            </button>
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
                    className="flex items-center gap-2 group text-gray-700 hover:underline cursor-pointer"
                  >
                    <span className="text-lg leading-none">•</span>
                    <span className="truncate">{comp}</span>
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
