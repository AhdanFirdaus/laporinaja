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
          .from("foto-keluhan")
          .getPublicUrl(complaint.photo_path);
        imageUrl = data.publicUrl;
        console.log("================");
        console.log(complaint.photo_path);
        console.log(imageUrl);
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

      <div className="mt-12 border-t pt-8 border-gray-400">
        <h2 className="text-3xl font-bold font-second text-soft-orange mb-6 tracking-tight">
          Lihat Keluhan
        </h2>
        {complaintHistory.length === 0 ? (
          <p className="text-gray-500 text-lg italic text-center py-8">
            Belum ada keluhan yang diajukan.
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
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
      </div>
    </>
  );
};

export default ComplaintsList;