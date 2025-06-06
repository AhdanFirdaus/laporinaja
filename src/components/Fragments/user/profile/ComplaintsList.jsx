import { useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import semarangGeoJSON from "../../../../../public/semarang_kecamatan.json";
import Modal from "../../../Elements/Modal"; 

const keluhanData = {
  "Semarang Tengah": 2,
  "Semarang Utara": 18,
  "Semarang Timur": 8,
  Tugu: 1,
  Pedurungan: 15,
  Ngaliyan: 3,
  // Tambah data lainnya...
};

// Enhanced complaint data with image placeholder
const complaintHistory = [
  {
    id: 1,
    userId: "USR123",
    label: "Menunggu",
    date: "2025-06-01",
    title: "Jalan di daerah ini sangat berlubang, mohon segera diperbaiki.",
    note: "Gambar jalan berlubang diunggah.",
    imageUrl: "https://via.placeholder.com/300x200?text=Jalan+Berlubang",
  },
  {
    id: 2,
    userId: "USR456",
    label: "Proses",
    date: "2025-06-03",
    title: "Lampu jalan mati sejak seminggu lalu, tolong diperbaiki.",
    note: "Foto lampu jalan mati tersedia.",
    imageUrl: "https://via.placeholder.com/300x200?text=Lampu+Jalan+Mati",
  },
  {
    id: 3,
    userId: "USR789",
    label: "Selesai",
    date: "2025-06-04",
    title: "Sampah menumpuk di pinggir jalan, perlu segera dibersihkan.",
    note: "Catatan: Sudah dikoordinasikan dengan dinas kebersihan.",
    imageUrl: "https://via.placeholder.com/300x200?text=Sampah+Menumpuk",
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const handleDetailClick = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
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
        <p className="text-gray-500 text-lg italic text-center py-8">
          Belum ada keluhan yang diajukan.
        </p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          {complaintHistory.map((complaint) => (
            <li
              key={complaint.id}
              className="border border-gray-200 p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="space-y-4">
                {/* Top Section: Date and Label */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{complaint.date}</span>
                  <span
                    className={`text-sm font-medium py-1 px-3 rounded-full ${
                      complaint.label === "Menunggu"
                        ? "bg-yellow-100 text-yellow-800"
                        : complaint.label === "Proses"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {complaint.label}
                  </span>
                </div>
                {/* Title Section */}
                <p className="text-md text-gray-600">
                  <h3 className="line-clamp-3 break-all font-semibold">{complaint.title}</h3>
                </p>
                {/* Note Section */}
                {complaint.note && (
                  <p className="text-md text-gray-600">
                    <span className="line-clamp-2 break-all">{complaint.note}</span>
                  </p>
                )}
                {/* Button Section */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => handleDetailClick(complaint)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors hover:underline cursor-pointer"
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {selectedComplaint && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={selectedComplaint.title}
        //   maxHeight="80vh"
          className="z-10 mx-6 my-6"
          footer={
            <button
              onClick={closeModal}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tutup
            </button>
          }
        >
          <div className="space-y-4">
            <p className="text-md text-gray-600">
              <span className="font-medium">Tanggal:</span>{" "}
              <span>{selectedComplaint.date}</span>
            </p>
            <p className="text-md text-gray-600">
              <span className="font-medium">Status:</span>{" "}
              <span>{selectedComplaint.label}</span>
            </p>
            <p className="text-md text-gray-600">
              <span className="font-medium">User ID:</span>{" "}
              <span>{selectedComplaint.userId}</span>
            </p>
            <p className="text-md text-gray-600">
              <span className="font-medium">Catatan:</span>{" "}
              <span>{selectedComplaint.note}</span>
            </p>
            {selectedComplaint.imageUrl && (
              <div className="mt-4">
                <img
                  src={selectedComplaint.imageUrl}
                  alt={selectedComplaint.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default ComplaintsList;