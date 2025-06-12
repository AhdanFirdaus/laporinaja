import { useState, useCallback } from "react";
import DetailComplaintModal from "../DetailComplaintModal";
import CardComplaint from "../CardComplaint";
import { showConfirmation, showSuccess } from "../../Elements/Alert";

const initialComplaints = [
  {
    id: 1,
    title: "Jalan rusak di Jl. Gajahmada",
    note: "Sudah lebih dari seminggu tidak diperbaiki",
    location: "Jl. Gajahmada",
    category: "Jalan",
    date: "2025-06-06",
    label: "Menunggu",
    imageUrl: "/img/jalan-rusak.jpg",
  },
  {
    id: 2,
    title: "Lampu jalan mati",
    note: "Lampu mati di tikungan Jl. Pahlawan, sangat gelap",
    location: "Jl. Pahlawan",
    category: "Penerangan",
    date: "2025-06-05",
    label: "Selesai",
    imageUrl: "/img/lampu-mati.jpg",
  },
  {
    id: 3,
    title: "Sampah menumpuk",
    note: "Tumpukan sampah di dekat pasar belum diangkut",
    location: "Pasar Johar",
    category: "Sampah",
    date: "2025-06-01",
    label: "Selesai",
    imageUrl: "/img/sampah.jpg",
  },
];

const Complaints = () => {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState({});
  const complaintsPerPage = 5;

  const statusOptions = ["Menunggu", "Proses", "Selesai", "Ditolak"];

  const openDetailModal = (complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedComplaint(null);
  };

  const handleStatusChange = useCallback((complaint, nextLabel) => {
    showConfirmation({
      title: "Konfirmasi Perubahan Status",
      text: `Apakah Anda yakin ingin mengubah status keluhan "${complaint.title}" ke ${nextLabel}?`,
      confirmButtonText: "Ubah Status",
    }).then((result) => {
      if (result.isConfirmed) {
        setComplaints((prev) =>
          prev.map((comp) =>
            comp.id === complaint.id ? { ...comp, label: nextLabel } : comp
          )
        );
        showSuccess({
          title: "Berhasil!",
          text: `Status berhasil diubah ke ${nextLabel}.`,
        });
      }
    });
  }, []);

  const handleDeleteComplaint = useCallback((complaint) => {
    showConfirmation({
      title: "Konfirmasi Hapus Keluhan",
      text: `Apakah Anda yakin ingin menghapus keluhan "${complaint.title}"?`,
      confirmButtonText: "Hapus",
    }).then((result) => {
      if (result.isConfirmed) {
        setComplaints((prev) =>
          prev.filter((comp) => comp.id !== complaint.id)
        );
        showSuccess({
          title: "Berhasil!",
          text: `Keluhan "${complaint.title}" telah dihapus.`,
        });
      }
    });
  }, []);

  const getActions = useCallback(
    (complaint) => {
      return [
        {
          label: "Ubah Status",
          selectOptions: statusOptions
            .filter((status) => status !== complaint.label)
            .map((status) => ({
              value: status,
              label: status,
              onSelect: () => handleStatusChange(complaint, status),
            })),
        },
        {
          label: "Lihat Detail",
          onClick: () => openDetailModal(complaint),
        },
        {
          label: "Hapus",
          onClick: () => handleDeleteComplaint(complaint),
        },
      ];
    },
    [handleStatusChange, handleDeleteComplaint]
  );

  const renderSection = (label, title) => {
    const filtered = complaints.filter((c) => c.label === label);
    const currentSectionPage = currentPage[label] || 1;
    const indexOfLastComplaint = currentSectionPage * complaintsPerPage;
    const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
    const currentComplaints = filtered.slice(
      indexOfFirstComplaint,
      indexOfLastComplaint
    );
    const totalPages = Math.ceil(filtered.length / complaintsPerPage);

    const handlePageChange = (page) => {
      setCurrentPage((prev) => ({ ...prev, [label]: page }));
    };

    const renderPageNumbers = () => {
      const pageNumbers = [];
      const maxVisiblePages = 5;
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentSectionPage - halfVisible);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 rounded-full ${
              currentSectionPage === i
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
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className=" font-semibold text-gray-700">{title}</h2>
          <span className="text-sm bg-gray-200 text-gray-700 font-semibold px-3 py-1 rounded-full">
            {filtered.length}
          </span>
        </div>
        <ul className="space-y-4 overflow-visible">
          {currentComplaints.map((complaint) => (
            <CardComplaint
              key={complaint.id}
              complaint={complaint}
              actions={getActions(complaint)}
              className={
                complaint.label === "Selesai" || complaint.label === "Ditolak"
                  ? "bg-gray-200 text-gray-500"
                  : ""
              }
            />
          ))}
        </ul>
        {filtered.length > complaintsPerPage && (
          <div className="flex justify-center mt-4 space-x-2 items-center">
            <button
              onClick={() =>
                handlePageChange(Math.max(currentSectionPage - 1, 1))
              }
              disabled={currentSectionPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-soft-orange/20 cursor-pointer"
            >
              Previous
            </button>
            {renderPageNumbers()}
            <button
              onClick={() =>
                handlePageChange(Math.min(currentSectionPage + 1, totalPages))
              }
              disabled={currentSectionPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-soft-orange/20 cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {renderSection("Menunggu", "Keluhan Menunggu")}
      {renderSection("Proses", "Keluhan Diproses")}
      {renderSection("Selesai", "Keluhan Selesai")}
      {renderSection("Ditolak", "Keluhan Ditolak")}
      <DetailComplaintModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        complaint={selectedComplaint}
      />
    </div>
  );
};

export default Complaints;
