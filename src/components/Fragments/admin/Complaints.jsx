import { useState } from "react";
import DetailComplaintModal from "../DetailComplaintModal";
import CardComplaint from "../CardComplaint";
import Modal from "../../Elements/Modal";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

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

    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        complaint: null,
        nextLabel: "",
    });

    const openDetailModal = (complaint) => {
        setSelectedComplaint(complaint);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedComplaint(null);
    };

    const openConfirmationModal = (complaint, nextLabel) => {
        setConfirmationModal({
            isOpen: true,
            complaint,
            nextLabel,
        });
    };

    const closeConfirmationModal = () => {
        setConfirmationModal({
            isOpen: false,
            complaint: null,
            nextLabel: "",
        });
    };

    const confirmStatusChange = () => {
        const { complaint, nextLabel } = confirmationModal;

        setComplaints((prev) =>
            prev.map((comp) =>
                comp.id === complaint.id ? { ...comp, label: nextLabel } : comp
            )
        );

        closeConfirmationModal();

        MySwal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: `Status berhasil diubah ke ${nextLabel}`,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
        });
    };

    const getActions = (complaint) => {
        if (complaint.label === "Menunggu") {
            return [
                {
                    label: "Proses", // Proses
                    onClick: () => openConfirmationModal(complaint, "Proses"),
                },
                {
                    label: "Lihat Detail", // Lihat Detail
                    onClick: () => openDetailModal(complaint),
                },
            ];
        } else if (complaint.label === "Proses") {
            return [
                {
                    label: "Selesai", // Selesai
                    onClick: () => openConfirmationModal(complaint, "Selesai"),
                },
                {
                    label: "Lihat Detail", // Lihat Detail
                    onClick: () => openDetailModal(complaint),
                },
            ];
        } else {
            return [
                {
                    label: "Lihat Detail", // Lihat Detail
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

            {/* Modal Detail */}
            <DetailComplaintModal
                isOpen={isDetailModalOpen}
                onClose={closeDetailModal}
                complaint={selectedComplaint}
            />

            {/* Modal Konfirmasi */}
            <Modal
                isOpen={confirmationModal.isOpen}
                onClose={closeConfirmationModal}
                title="Konfirmasi Perubahan Status"
                className="w-full max-w-md mx-4 sm:mx-6 md:mx-8"
                maxHeight="80vh"
                footer={
                    <div className="flex justify-end gap-3">
                        <button
                            className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400"
                            onClick={closeConfirmationModal}
                        >
                            Batal
                        </button>
                        <button
                            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            onClick={confirmStatusChange}
                        >
                            Ubah Status
                        </button>
                    </div>
                }
            >
                <p className="text-sm md:text-base text-gray-700">
                    Apakah Anda yakin ingin mengubah status keluhan "
                    <strong>{confirmationModal.complaint?.title}</strong>" ke{" "}
                    <strong>{confirmationModal.nextLabel}</strong>?
                </p>
            </Modal>

        </div>
    );
};

export default Complaints;
