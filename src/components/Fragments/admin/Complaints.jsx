import { useState } from "react";
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
        label: "Proses",
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

    const openDetailModal = (complaint) => {
        setSelectedComplaint(complaint);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedComplaint(null);
    };

const handleStatusChange = (complaint, nextLabel) => {
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
};

    const getActions = (complaint) => {
        if (complaint.label === "Menunggu") {
            return [
                {
                    label: "Proses",
                    onClick: () => handleStatusChange(complaint, "Proses"),
                },
                {
                    label: "Lihat Detail",
                    onClick: () => openDetailModal(complaint),
                },
            ];
        } else if (complaint.label === "Proses") {
            return [
                {
                    label: "Selesai",
                    onClick: () => handleStatusChange(complaint, "Selesai"),
                },
                {
                    label: "Lihat Detail",
                    onClick: () => openDetailModal(complaint),
                },
            ];
        } else {
            return [
                {
                    label: "Lihat Detail",
                    onClick: () => openDetailModal(complaint),
                },
            ];
        }
    };

    const renderSection = (label, title) => {
        const filtered = complaints.filter((c) => c.label === label);

        return (
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
                    <span className="text-sm bg-gray-200 text-gray-700 font-semibold px-3 py-1 rounded-full">
                        {filtered.length}
                    </span>
                </div>
                <ul className="space-y-4">
                    {filtered.map((complaint) => (
                        <CardComplaint
                            key={complaint.id}
                            complaint={complaint}
                            actions={getActions(complaint)}
                            className={
                                complaint.label === "Selesai"
                                    ? "bg-gray-200 text-gray-500 grayscale cursor-not-allowed"
                                    : ""
                            }
                        />
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div>
            {renderSection("Menunggu", "Keluhan Menunggu")}
            {renderSection("Proses", "Keluhan Diproses")}
            {renderSection("Selesai", "Keluhan Selesai")}

            <DetailComplaintModal
                isOpen={isDetailModalOpen}
                onClose={closeDetailModal}
                complaint={selectedComplaint}
            />
        </div>
    );
};

export default Complaints;
