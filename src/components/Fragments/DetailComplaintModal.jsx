import Modal from "../Elements/Modal";
import Button from "../Elements/Button";

const DetailComplaintModal = ({ isOpen, onClose, complaint }) => {
  if (!complaint) return null;

  // Tetapkan default label jika tidak ada
  const label = complaint.label || "Menunggu";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Keluhan"
      className="z-10 mx-6 my-6 w-full"
      footer={
        <Button onClick={onClose} className="w-full">
          Tutup
        </Button>
      }
    >
      <div className="space-y-4">
        <p className="text-md text-gray-600">
          <span className="font-medium">Judul:</span>{" "}
          <span>{complaint.title}</span>
        </p>
        <p className="text-md text-gray-600">
          <span className="font-medium">Catatan:</span>{" "}
          <span>{complaint.note}</span>
        </p>
        <p className="text-md text-gray-600">
          <span className="font-medium">Lokasi:</span>{" "}
          <span>{complaint.location}</span>
        </p>
        <p className="text-md text-gray-600">
          <span className="font-medium">Kategori:</span>{" "}
          <span>{complaint.category}</span>
        </p>
        <p className="text-md text-gray-600">
          <span className="font-medium">Status:</span>{" "}
          <span>{label}</span>
        </p>
        <p className="text-md text-gray-600">
          <span className="font-medium">Tanggal:</span>{" "}
          <span>{complaint.date}</span>
        </p>
        {complaint.imageUrl && (
          <div className="mt-4">
            <p className="text-md text-gray-600 font-medium">Foto:</p>
            <img
              src={complaint.imageUrl}
              alt={complaint.title}
              className="w-96 h-96 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DetailComplaintModal;