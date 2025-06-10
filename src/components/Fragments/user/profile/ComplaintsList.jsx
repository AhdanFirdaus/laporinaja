import { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import semarangGeoJSON from "../../../../../public/semarang_kecamatan.json";
import CardComplaint from "../../CardComplaint";
import DetailComplaintModal from "../../DetailComplaintModal";
import supabase from "../../../../../supabaseClient";

const keluhanData = {
  "Semarang Tengah": 2,
  "Semarang Utara": 18,
  "Semarang Timur": 8,
  Tugu: 1,
  Pedurungan: 15,
  Ngaliyan: 3,
  // Tambah data lainnya...
};

const getColor = (keluhan) => {
  if (keluhan > 15) return "red";
  if (keluhan > 5) return "orange";
  return "green";
};

const ComplaintsList = () => {
  const [complaintHistory, setComplaintHistory] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch complaints from Supabase
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data, error } = await supabase
          .from("keluhan")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching complaints:", error.message);
          return;
        }

        setComplaintHistory(data || []);
      } catch (err) {
        console.error("Unexpected error:", err.message);
      }
    };

    fetchComplaints();
  }, []);

  const style = (feature) => ({
    fillColor: getColor(keluhanData[feature.properties.NAMA_KEC] || 0),
    weight: 1,
    color: "white",
    fillOpacity: 0.8,
  });

  const handleDetailClick = async (complaint) => {
    let imageUrl = null;
    if (complaint.photo_path) {
      try {
        const { data } = await supabase.storage
          .from("foto-keluhan") // Replace with your actual bucket name
          .getPublicUrl(complaint.photo_path);
        imageUrl = data.publicUrl;
        console.log("================")
        console.log(complaint.photo_path)
        console.log(imageUrl)
      } catch (err) {
        console.error("Error fetching public URL:", err.message);
      }
    }

    setSelectedComplaint({ ...complaint, imageUrl });
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