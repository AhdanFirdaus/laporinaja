import { useState, useCallback, useEffect} from "react";
import DetailComplaintModal from "../DetailComplaintModal";
import CardComplaint from "../CardComplaint";
import { showConfirmation, showSuccess } from "../../Elements/Alert";
import supabase from "../../../../supabaseClient";
import { image } from "framer-motion/client";

const labelToStatus = {
  waiting: "waiting",
  Proses: "processing",
  Selesai: "done",
  Ditolak: "reject",
};

const Complaints = ({ autoOpenComplaintId, clearAutoOpenId }) => {
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState({});
    const complaintsPerPage = 5;



    const statusOptions = ["waiting", "processing", "done", "reject"];

    const fetchComplaints = useCallback(async () => {
    const { data, error } = await supabase
      .from("keluhan")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching complaints:", error.message);
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
      console.log(complaints) // it displayed
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  useEffect(() => {
  if (autoOpenComplaintId && complaints.length > 0) {
    const matchedComplaint = complaints.find(c => c.id === autoOpenComplaintId);
    if (matchedComplaint) {
      openDetailModal(matchedComplaint);
      clearAutoOpenId(); // Clear after opening
    }
  }
}, [autoOpenComplaintId, complaints]);

    const openDetailModal = async (complaint) => {
    const { data, error } = supabase.storage
        .from("foto-keluhan")
        .getPublicUrl(complaint.imageUrl);
    console.log("hai")
    console.log(complaint)
    console.log(data)
    console.log(complaint.photo_path)
    if (error) {
        console.error("Failed to get image URL:", error.message);
        return;
    }

    const updatedComplaint = {
        ...complaint,
        imageUrl: data.publicUrl,
    };

    setSelectedComplaint(updatedComplaint);
    setIsDetailModalOpen(true);
};


  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedComplaint(null);
  };

    const handleStatusChange = useCallback(
  (complaint, nextLabel) => {
    console.log("-------------------------")
    showConfirmation({
      title: "Konfirmasi Perubahan Status",
      text: `Apakah Anda yakin ingin mengubah status keluhan "${complaint.title}" ke ${nextLabel}?`,
      confirmButtonText: "Ubah Status",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      // 1️⃣ Convert label → enum value expected by DB
      const newStatus = labelToStatus[nextLabel];
      console.log(nextLabel)

      // 2️⃣ Update row in Supabase
      const { error } = await supabase
        .from("keluhan")
        .update({ status: nextLabel })
        .eq("id", complaint.id);

      if (error) {
        console.error("Gagal mengubah status di Supabase:", error.message);
        showError({
          title: "Gagal!",
          text: "Status tidak berhasil diperbarui. Silakan coba lagi.",
        });
        return;
      }

      // 3️⃣ Reflect change in local state
      setComplaints((prev) =>
        prev.map((comp) =>
          comp.id === complaint.id ? { ...comp, label: nextLabel } : comp
        )
      );

      // 4️⃣ Show success toast
      showSuccess({
        title: "Berhasil!",
        text: `Status berhasil diubah ke ${nextLabel}.`,
      });
    });
  },
  []
);

    const handleDeleteComplaint = useCallback((complaint) => {
    console.log("=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    console.log(complaint);
    
    showConfirmation({
        title: "Konfirmasi Hapus Keluhan",
        text: `Apakah Anda yakin ingin menghapus keluhan "${complaint.title}"?`,
        confirmButtonText: "Hapus",
    }).then(async (result) => {
        if (result.isConfirmed) {
            // Delete from Supabase
            const { error } = await supabase
                .from("keluhan")
                .delete()
                .eq("id", complaint.id);

            if (error) {
                console.error("Gagal menghapus dari Supabase:", error.message);
                return;
            }

            const {image_error} = await supabase
            .storage
            .from("foto-keluhan")
            .remove([complaint.imageUrl]);

            if (image_error) {
                console.error("Gagal menghapus dari Supabase:", image_error.message);
                return;
            }


            // Update UI after successful deletion
            setComplaints((prev) => prev.filter((comp) => comp.id !== complaint.id));
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
            className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-sm sm:text-base ${
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
          <h2 className="font-semibold text-gray-700 text-base sm:text-lg md:text-xl">
            {title}
          </h2>
          <span className="text-xs sm:text-sm bg-gray-200 text-gray-700 font-semibold px-2 sm:px-3 py-1 rounded-full">
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
          <div className="flex justify-center mt-4 space-x-1 sm:space-x-2 items-center flex-wrap gap-y-2">
            <button
              onClick={() =>
                handlePageChange(Math.max(currentSectionPage - 1, 1))
              }
              disabled={currentSectionPage === 1}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-soft-orange/20 cursor-pointer text-sm sm:text-base"
            >
              Previous
            </button>
            <div className="flex space-x-1 sm:space-x-2 flex-wrap justify-center gap-y-2">
              {renderPageNumbers()}
            </div>
            <button
              onClick={() =>
                handlePageChange(Math.min(currentSectionPage + 1, totalPages))
              }
              disabled={currentSectionPage === totalPages}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-soft-orange/20 cursor-pointer text-sm sm:text-base"
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
            {renderSection("waiting", "Keluhan Menunggu")}
            {renderSection("processing", "Keluhan Diproses")}
            {renderSection("done", "Keluhan Selesai")}
            {renderSection("reject", "Keluhan Ditolak")}
            <DetailComplaintModal
                isOpen={isDetailModalOpen}
                onClose={closeDetailModal}
                complaint={selectedComplaint}
            />
        </div>
    );
};

export default Complaints;