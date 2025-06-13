import { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import semarangGeoJSON from "../../../../../public/semarang_kecamatan.json";
import CardComplaint from "../../CardComplaint";
import DetailComplaintModal from "../../DetailComplaintModal";
import supabase from "../../../../../supabaseClient";

const getColor = (keluhan) => {
  if (keluhan > 15) return "red";
  if (keluhan > 5) return "orange";
  return "green";
};

const ComplaintsList = () => {
  const [complaintHistory, setComplaintHistory] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSectionPage, setCurrentSectionPage] = useState(1);
  const complaintsPerPage = 6;
  const [keluhanData, setKeluhanData] = useState({});
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data, error } = await supabase
          .from("keluhan")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          Swal.fire({
            icon: "error",
            title: "Gagal Memuat Laporan",
            text:
              error?.message ||
              "Terjadi kesalahan saat mengambil data laporan.",
            timer: 3000,
            showConfirmButton: false,
          });
          return;
        }

        setComplaintHistory(data || []);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Kesalahan Tak Terduga",
          text: err?.message || "Terjadi kesalahan yang tidak diketahui.",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    };

    fetchComplaints();
  }, []);

  useEffect(() => {
    fetch("/export.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => {});
  }, []);

  useEffect(() => {
    const fetchKeluhanCountByLocation = async () => {
      try {
        const { data, error } = await supabase
          .from("keluhan")
          .select("location");

        if (error) {
          return false;
        }

        const counts = data.reduce((acc, curr) => {
          const loc = curr.location;
          acc[loc] = (acc[loc] || 0) + 1;
          return acc;
        }, {});

        setKeluhanData(counts);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Kesalahan Tak Terduga",
          text: err?.message || "Terjadi kesalahan yang tidak diketahui.",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    };

    fetchKeluhanCountByLocation();
  }, []);

  const style = (feature) => ({
    fillColor: getColor(keluhanData[feature.properties.name]),
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
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Gagal Mengambil URL Publik",
          text: err?.message || "Terjadi kesalahan saat mengambil URL.",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    }

    setSelectedComplaint({ ...complaint, imageUrl });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedComplaint(null);
    setIsModalOpen(false);
  };

  const kecamatanList = Object.entries(keluhanData).map(
    ([kecamatan, keluhan]) => ({
      name: kecamatan,
      keluhan,
      color: getColor(keluhan),
    })
  );

  const minimKeluhan = kecamatanList.filter((item) => item.color === "green");
  const banyakKeluhan = kecamatanList.filter((item) => item.color !== "green");

  const totalPages = Math.ceil(complaintHistory.length / complaintsPerPage);
  const indexOfLastComplaint = currentSectionPage * complaintsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
  const currentComplaints = complaintHistory.slice(
    indexOfFirstComplaint,
    indexOfLastComplaint
  );

  const handlePageChange = (pageNumber) => {
    setCurrentSectionPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
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
    <>
      <MapContainer
        center={[-6.9871, 110.422]}
        zoom={12}
        className="w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl z-0"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {geoData && <GeoJSON data={geoData} style={style} />}
      </MapContainer>
      <div className="my-6">
        <div className="flex flex-col md:flex-row shadow rounded-xl overflow-hidden">
          <div className="w-full md:w-1/2 bg-green-500/10 p-4">
            <h2 className="text-green-600 font-semibold text-base sm:text-lg mb-3">
              Minim Keluhan
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base">
              {minimKeluhan.map((item) => (
                <li key={item.name} className="text-gray-700">
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden md:block w-px bg-gray-300"></div>
          <div className="w-full md:w-1/2 bg-red-500/10 p-4">
            <h2 className="text-red-600 font-semibold text-base sm:text-lg mb-3">
              Banyak Keluhan
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base">
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
        <h2 className="text-2xl sm:text-3xl font-bold font-second text-soft-orange mb-6 tracking-tight">
          Lihat Keluhan
        </h2>
        {complaintHistory.length === 0 ? (
          <p className="text-gray-500 text-base sm:text-lg italic text-center py-8">
            Belum ada keluhan yang diajukan.
          </p>
        ) : (
          <>
            <ul className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {currentComplaints.map((complaint) => (
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
            {complaintHistory.length > complaintsPerPage && (
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
                    handlePageChange(
                      Math.min(currentSectionPage + 1, totalPages)
                    )
                  }
                  disabled={currentSectionPage === totalPages}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-soft-orange/20 cursor-pointer text-sm sm:text-base"
                >
                  Next
                </button>
              </div>
            )}
          </>
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