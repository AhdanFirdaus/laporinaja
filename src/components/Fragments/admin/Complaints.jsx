import { useState, useCallback, useEffect } from "react";
import DetailComplaintModal from "../DetailComplaintModal";
import CardComplaint from "../CardComplaint";
import { showConfirmation, showSuccess, showError } from "../../Elements/Alert";
import supabase from "../../../../supabaseClient";

const statusLabels = {
  waiting: "Menunggu",
  processing: "Diproses",
  done: "Selesai",
  reject: "Ditolak",
};

const Complaints = ({ autoOpenComplaintId, clearAutoOpenId }) => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState({});
  const complaintsPerPage = 5;

  const statusEnums = Object.keys(statusLabels);

  const fetchComplaints = useCallback(async () => {
    const { data, error } = await supabase
      .from("keluhan")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Laporan",
        text:
          error?.message || "Terjadi kesalahan saat mengambil data laporan.",
        timer: 3000,
        showConfirmButton: false,
      });
    } else {
      const formatted = data.map((item) => ({
        id: item.id,
        title: item.title,
        note: item.note,
        location: item.location,
        category: item.category,
        date: item.incident_date,
        label: item.status,
        imageUrl: item.photo_path || "/img/placeholder.jpg",
      }));
      setComplaints(formatted);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  useEffect(() => {
    if (autoOpenComplaintId && complaints.length > 0) {
      const matched = complaints.find((c) => c.id === autoOpenComplaintId);
      if (matched) {
        openDetailModal(matched);
        clearAutoOpenId();
      }
    }
  }, [autoOpenComplaintId, complaints]);

  const openDetailModal = async (complaint) => {
    const { data, error } = supabase.storage
      .from("foto-keluhan")
      .getPublicUrl(complaint.imageUrl);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Mengambil URL Gambar",
        text: error?.message || "Terjadi kesalahan saat mengambil URL gambar.",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    setSelectedComplaint({
      ...complaint,
      imageUrl: data.publicUrl,
    });
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedComplaint(null);
  };

  const handleStatusChange = useCallback((complaint, newEnum) => {
    const labelUI = statusLabels[newEnum];

    showConfirmation({
      title: "Konfirmasi Perubahan Status",
      text: `Ubah status keluhan "${complaint.title}" ke ${labelUI}?`,
      confirmButtonText: "Ubah Status",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      const { error } = await supabase
        .from("keluhan")
        .update({ status: newEnum })
        .eq("id", complaint.id);

      if (error) {
        showError({
          title: "Gagal!",
          text: "Status gagal diubah. Coba lagi.",
        });
        return;
      }

      setComplaints((prev) =>
        prev.map((c) => (c.id === complaint.id ? { ...c, label: newEnum } : c))
      );

      showSuccess({
        title: "Berhasil!",
        text: `Status diubah ke ${labelUI}.`,
      });
    });
  }, []);

  const handleDeleteComplaint = useCallback((complaint) => {
    showConfirmation({
      title: "Konfirmasi Hapus",
      text: `Yakin ingin menghapus keluhan "${complaint.title}"?`,
      confirmButtonText: "Hapus",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      const { error } = await supabase
        .from("keluhan")
        .delete()
        .eq("id", complaint.id);

      if (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal Menghapus Keluhan",
          text:
            error?.message || "Terjadi kesalahan saat menghapus data keluhan.",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }

      const { error: imgError } = await supabase.storage
        .from("foto-keluhan")
        .remove([complaint.imageUrl]);

      if (imgError) {
        Swal.fire({
          icon: "error",
          title: "Gagal Menghapus Gambar",
          text: imgError?.message || "Terjadi kesalahan saat menghapus gambar.",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }

      setComplaints((prev) => prev.filter((c) => c.id !== complaint.id));

      showSuccess({
        title: "Berhasil!",
        text: `Keluhan "${complaint.title}" telah dihapus.`,
      });
    });
  }, []);

  const getActions = useCallback(
    (complaint) => [
      {
        label: "Ubah Status",
        selectOptions: statusEnums
          .filter((status) => status !== complaint.label)
          .map((status) => ({
            value: status,
            label: statusLabels[status],
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
    ],
    [handleStatusChange, handleDeleteComplaint]
  );

  const renderSection = (labelEnum) => {
    const sectionLabel = statusLabels[labelEnum];
    const filtered = complaints.filter((c) => c.label === labelEnum);
    const currentSectionPage = currentPage[labelEnum] || 1;
    const indexOfLast = currentSectionPage * complaintsPerPage;
    const currentComplaints = filtered.slice(
      indexOfLast - complaintsPerPage,
      indexOfLast
    );
    const totalPages = Math.ceil(filtered.length / complaintsPerPage);

    const handlePageChange = (page) => {
      setCurrentPage((prev) => ({ ...prev, [labelEnum]: page }));
    };

    const renderPageNumbers = () => {
      const pageNumbers = [];
      const maxVisible = 5;
      const half = Math.floor(maxVisible / 2);
      let start = Math.max(1, currentSectionPage - half);
      let end = Math.min(totalPages, start + maxVisible - 1);
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-2 py-1 rounded-full text-sm ${
              currentSectionPage === i
                ? "bg-soft-orange text-white"
                : "bg-gray-200 text-gray-700 hover:bg-soft-orange/20"
            }`}
          >
            {i}
          </button>
        );
      }

      return pageNumbers;
    };

    return (
      <div className="mb-8" key={labelEnum}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg text-gray-700">
            {sectionLabel}
          </h2>
          <span className="text-sm bg-gray-200 text-gray-700 font-semibold px-3 py-1 rounded-full">
            {filtered.length}
          </span>
        </div>
        <ul className="space-y-4">
          {currentComplaints.map((complaint) => (
            <CardComplaint
              key={complaint.id}
              complaint={complaint}
              actions={getActions(complaint)}
              className={
                complaint.label === "done" || complaint.label === "reject"
                  ? "bg-gray-200 text-gray-500"
                  : ""
              }
            />
          ))}
        </ul>
        {filtered.length > complaintsPerPage && (
          <div className="flex justify-center mt-4 items-center space-x-2 flex-wrap gap-y-2">
            <button
              onClick={() =>
                handlePageChange(Math.max(currentSectionPage - 1, 1))
              }
              disabled={currentSectionPage === 1}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-soft-orange/20 text-sm"
            >
              Previous
            </button>
            <div className="flex space-x-2">{renderPageNumbers()}</div>
            <button
              onClick={() =>
                handlePageChange(Math.min(currentSectionPage + 1, totalPages))
              }
              disabled={currentSectionPage === totalPages}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-soft-orange/20 text-sm"
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
      {statusEnums.map((status) => renderSection(status))}
      <DetailComplaintModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        complaint={selectedComplaint}
      />
    </div>
  );
};

export default Complaints;
