import { useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import semarangGeoJSON from "../../../public/semarang_kecamatan.json";
import Modal from "../Elements/Modal";
import Button from "../Elements/Button";
import CardComplaint from "./CardComplaint";
import DetailComplaintModal from "./DetailComplaintModal";

const keluhanData = {
  "Semarang Tengah": 2,
  "Semarang Utara": 18,
  "Semarang Timur": 8,
  Tugu: 1,
  Pedurungan: 15,
  Ngaliyan: 3,
  // Tambah data lainnya...
};

// Enhanced complaint data with additional fields
const complaintHistory = [
  {
    id: 1,
    userId: "USR123",
    label: "Menunggu",
    date: "2025-06-01",
    title:
      "Jalan di daerah ini sangat berlubang, mohon segera diperbaiki.Jalan di daerah ini sangat berlubang, mohon segera diperbaiki.Jalan di daerah ini sangat berlubang, mohon segera diperbaiki.Jalan di daerah ini sangat berlubang, mohon segera diperbaiki.",
    note: "Gambar jalan berlubang diunggah.Gambar jalan berlubang diunggah.Gambar jalan berlubang diunggah.Gambar jalan berlubang diunggah.Gambar jalan berlubang diunggah.Gambar jalan berlubang diunggah.Gambar jalan berlubang diunggah.",
    imageUrl:
      "https://images.unsplash.com/photo-1615143219212-fe08fb4a27e2?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Semarang Tengah",
    category: "Infrastruktur",
  },
  {
    id: 2,
    userId: "USR456",
    label: "Proses",
    date: "2025-06-03",
    title: "Lampu jalan mati sejak seminggu lalu, tolong diperbaiki.",
    note: "Foto lampu jalan mati tersedia.",
    imageUrl:
      "https://images.unsplash.com/photo-1601696935626-431bbe118c31?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Semarang Utara",
    category: "Penerangan",
  },
  {
    id: 3,
    userId: "USR789",
    label: "Selesai",
    date: "2025-06-04",
    title: "Sampah menumpuk di pinggir jalan, perlu segera dibersihkan.",
    note: "Catatan: Sudah dikoordinasikan dengan dinas kebersihan.",
    imageUrl: "https://via.placeholder.com/300x200?text=Sampah+Menumpuk",
    location: "Pedurungan",
    category: "Kebersihan",
  },
  {
    id: 4,
    userId: "USR123",
    label: "Menunggu",
    date: "2025-06-01",
    title:
      "Jalan di daerah ini sangat berlubang, mohon segera diperbaiki.Jalan di daerah ini sangat berlubang, mohon segera diperbaiki.Jalan di daerah ini sangat berlubang, mohon segera diperbaiki.Jalan di daerah ini sangat berlubang, mohon segera diperbaiki.",
    note: "Gambar jalan berlubang diunggah.Gambar jalan berlubang diunggah.Gambar jalan berlubang diunggah.Gambar jalan berlubang diunggah.Gambar jalan berlubang diunggah.Gambar jalan berlubang diunggah.Gambar jalan berlubang diunggah.",
    imageUrl:
      "https://images.unsplash.com/photo-1615143219212-fe08fb4a27e2?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Semarang Tengah",
    category: "Infrastruktur",
  },
];

const getColor = (keluhan) => {
  if (keluhan > 15) return "red";
  if (keluhan > 5) return "orange";
  return "green";
};

const ComplaintsList = () => {
  const style = (feature) => ({
    fillColor: getColor(keluhanData[feature.properties.NAMA_KEC] || 0),
    weight: 1,
    color: "white",
    fillOpacity: 0.8,
  });

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDetailClick = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedComplaint(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 justify-start my-6 text-center text-sm">
        <span className="bg-green-500/20 text-green-500 py-2 px-4 rounded-full">
          Minim Keluhan
        </span>
        <span className="bg-red-500/20 text-red-500 py-2 px-4 rounded-full">
          Banyak Keluhan
        </span>
      </div>
      <MapContainer
        center={[-6.9871, 110.422]}
        zoom={12}
        className="w-full h-[500px] rounded-2xl z-0"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GeoJSON data={semarangGeoJSON} style={style} />
      </MapContainer>
      <h2 className="text-3xl font-bold font-second text-soft-orange my-6 tracking-tight">
        Lihat Keluhan
      </h2>
      {complaintHistory.length === 0 ? (
        <p className="text-gray-500 text-lg italic text-center py-8 w-full">
          Belum ada keluhan yang diajukan.
        </p>
      ) : (
        <ul className="columns-1 sm:columns-2 w-full">
          {complaintHistory.map((complaint) => (
            <CardComplaint
              key={complaint.id}
              complaint={complaint}
              actions={[
                {
                  label: "Lihat Detail",
                  onClick: handleDetailClick,
                },
              ]}
            />
          ))}
        </ul>
      )}

      <DetailComplaintModal
        isOpen={isModalOpen}
        onClose={closeModal}
        complaint={selectedComplaint}
      />
    </>
  );
};

export default ComplaintsList;