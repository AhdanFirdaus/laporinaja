import { useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import semarangGeoJSON from "../../../../../public/semarang_kecamatan.json";
import CardComplaint from "../../CardComplaint";
import DetailComplaintModal from "../../DetailComplaintModal";

const keluhanData = {
  "Semarang Tengah": 2,
  "Semarang Utara": 18,
  "Semarang Timur": 8,
  Tugu: 1,
  Pedurungan: 15,
  Ngaliyan: 3,
};

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

  // Extract kecamatan and categorize based on keluhan
  const kecamatanList = Object.entries(keluhanData).map(
    ([kecamatan, keluhan]) => ({
      name: kecamatan,
      keluhan,
      color: getColor(keluhan),
    })
  );

  const minimKeluhan = kecamatanList.filter((item) => item.color === "green");
  const banyakKeluhan = kecamatanList.filter((item) => item.color !== "green");

  return (
    <>
      <MapContainer
        center={[-6.9871, 110.422]}
        zoom={12}
        className="w-full h-[500px] rounded-2xl z-0"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GeoJSON data={semarangGeoJSON} style={style} />
      </MapContainer>
      <div className="my-6">
        <div className="flex flex-col md:flex-row shadow rounded-xl overflow-hidden">
          {/* Minim Keluhan */}
          <div className="w-full md:w-1/2 bg-green-500/10 p-4">
            <h2 className="text-green-600 font-semibold text-lg mb-3">
              Minim Keluhan
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              {minimKeluhan.map((item) => (
                <li key={item.name} className="text-gray-700">
                  {item.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Separator (garis tengah hanya di desktop) */}
          <div className="hidden md:block w-px bg-gray-300"></div>

          {/* Banyak Keluhan */}
          <div className="w-full md:w-1/2 bg-red-500/10 p-4">
            <h2 className="text-red-600 font-semibold text-lg mb-3">
              Banyak Keluhan
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              {banyakKeluhan.map((item) => (
                <li key={item.name} className="text-gray-700">
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

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