import { useState, useRef, useEffect } from "react";
import Button from "../../../Elements/Button";
import Input from "../../../Elements/Input";
import Textarea from "../../../Elements/Textarea";
import Select from "../../../Elements/Select";
import InputUpload from "../../../Elements/InputUpload";
import CardComplaint from "../../../Fragments/CardComplaint";
import DetailComplaintModal from "../../../Fragments/DetailComplaintModal";
import { showConfirmation, showSuccess, showError } from "../../../Elements/Alert";
import supabase from "../../../../../supabaseClient";
import checkImageSize from "../../../../helper/checkImageSize";
import { isKecamatanValid } from "../../../../helper/isKecamatanValid";

const ReportForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    note: "",
    date: "",
    location: "",
    category: "",
    customCategory: "",
    lat: "",
    lon: "",
  });

  const [reportHistory, setReportHistory] = useState([]);
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSectionPage, setCurrentSectionPage] = useState(1);
  const complaintsPerPage = 6;

  useEffect(() => {
    const fetchUserAndReports = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          showError({
            title: "Gagal memuat pengguna",
            text: userError?.message || "Pengguna belum terautentikasi.",
            confirmButtonColor: "#d33",
          });
          return;
        }

        setUser(user);

        const { data, error } = await supabase
          .from("keluhan")
          .select("*")
          .eq("user_id", user.id)
          .order("incident_date", { ascending: false });

        if (error) {
          showError({
            title: "Gagal memuat laporan",
            text: error.message || "Terjadi kesalahan saat mengambil data laporan.",
            confirmButtonColor: "#d33",
          });
        } else {
          setReportHistory(data);
        }
      } catch (err) {
        showError({
          title: "Terjadi Kesalahan",
          text: err?.message || "Gagal memuat data pengguna dan laporan.",
          confirmButtonColor: "#d33",
        });
      }
    };

    fetchUserAndReports();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      showError({
        title: "Gagal",
        text: "User tidak ditemukan. Silakan login kembali.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const toast = showConfirmation({
      title: "Mengirim keluhan…",
      text: "",
      showCancelButton: false,
      confirmButtonText: "",
      cancelButtonText: "",
      confirmButtonColor: "#52BA5E",
      icon: "info",
    });

    try {
      let photoPath = null;

      if (formData.photo) {
        const sizeCheck = checkImageSize(formData.photo);
        if (!sizeCheck.valid) {
          toast.close();
          showError({
            title: "Upload Gagal",
            text: sizeCheck.message,
            confirmButtonColor: "#d33",
          });
          return;
        }

        const ext = formData.photo.name.split(".").pop();
        const fileName = `${Date.now()}_${crypto.randomUUID()}.${ext}`;
        const filePath = `${user.id}/${fileName}`;

        const { data: storageData, error: storageError } =
          await supabase.storage
            .from("foto-keluhan")
            .upload(filePath, formData.photo);

        if (storageError) {
          toast.close();
          showError({
            title: "Upload Gagal",
            text: "Terjadi kesalahan saat mengunggah foto: " + storageError.message,
            confirmButtonColor: "#d33",
          });
          return;
        }

        photoPath = storageData.path;
      }

      if (!isKecamatanValid(formData.location.toLowerCase())) {
        toast.close();
        showError({
          title: "Upload Data Gagal",
          text: "Kecamatan tidak valid",
          confirmButtonColor: "#d33",
        });
        return;
      }

      const { data, error: dbError } = await supabase
        .from("keluhan")
        .insert({
          title: formData.title,
          note: formData.note,
          incident_date: formData.date,
          location: formData.location.toLowerCase(),
          category:
            formData.category === "Lainnya"
              ? formData.customCategory
              : formData.category,
          custom_category:
            formData.category === "Lainnya" ? formData.customCategory : null,
          photo_path: photoPath,
          status: "waiting",
          user_id: user.id,
        })
        .select("id")
        .single();

      if (dbError) throw dbError;

      const newReport = {
        id: data.id,
        title: formData.title,
        note: formData.note,
        incident_date: formData.date,
        location: formData.location.toLowerCase(),
        category:
          formData.category === "Lainnya"
            ? formData.customCategory
            : formData.category,
        custom_category:
          formData.category === "Lainnya" ? formData.customCategory : null,
        photo_path: photoPath,
        status: "waiting",
        user_id: user.id,
      };
      setReportHistory([newReport, ...reportHistory]);

      setFormData({
        title: "",
        note: "",
        date: "",
        location: "",
        category: "",
        customCategory: "",
        photo: null,
        lat: "",
        lon: "",
      });

      toast.close();
      showSuccess({
        title: "Berhasil!",
        text: "Keluhan Anda telah dikirim.",
        confirmButtonColor: "#52BA5E",
      });
    } catch (err) {
      toast.close();
      showError({
        title: "Gagal",
        text: err.message || "Terjadi kesalahan.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await showConfirmation({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menghapus keluhan ini?",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#52BA5E",
      cancelButtonColor: "#d33",
      icon: "warning",
    });

    if (!result.isConfirmed) return;

    const report = reportHistory.find((r) => r.id === id);
    const photoPath = report?.photo_path;

    try {
      const { error: deleteError } = await supabase
        .from("keluhan")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      if (photoPath) {
        const { error: storageError } = await supabase.storage
          .from("foto-keluhan")
          .remove([photoPath]);

        if (storageError) throw storageError;
      }

      setReportHistory(reportHistory.filter((r) => r.id !== id));

      showSuccess({
        title: "Dihapus!",
        text: "Keluhan telah dihapus.",
        confirmButtonColor: "#52BA5E",
      });
    } catch (err) {
      showError({
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus keluhan.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleClearFile = () => {
    setFormData({ ...formData, photo: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDetailClick = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const totalPages = Math.ceil(reportHistory.length / complaintsPerPage);
  const indexOfLastComplaint = currentSectionPage * complaintsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
  const currentComplaints = reportHistory.slice(
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

  const categoryOptions = [
    "Jalan dan Trotoar",
    "Penerangan Jalan",
    "Saluran Air",
    "Sampah",
    "Sungai",
    "Lainnya",
  ];

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full font-primary">
        <Input
          label="Judul"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <Textarea
          label="Catatan"
          name="note"
          value={formData.note}
          onChange={handleChange}
          required
        />
        <Input
          label="Tanggal Kejadian"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <Input
          label="Lokasi (Alamat, Kecamatan/Desa/Kelurahan)"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <Select
          label="Kategori"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categoryOptions}
          required
        />
        {formData.category === "Lainnya" && (
          <Input
            label="Masukkan Kategori Lainnya"
            name="customCategory"
            value={formData.customCategory}
            onChange={handleChange}
            required
            placeholder="Masukkan kategori lainnya"
          />
        )}
        <div className="mb-10">
          <InputUpload
            label="Foto"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
            onClear={handleClearFile}
            ref={fileInputRef}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button type="submit">Kirim Keluhan</Button>
        </div>
      </form>

      <div className="mt-12 border-t pt-8 bg-gray-50">
        <h2 className="text-2xl sm:text-3xl font-bold font-second text-soft-orange mb-6 tracking-tight">
          Riwayat Keluhan
        </h2>
        {reportHistory.length === 0 ? (
          <p className="text-gray-500 text-base sm:text-lg italic text-center py-8">
            Belum ada keluhan yang diajukan.
          </p>
        ) : (
          <>
            <ul className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {currentComplaints.map((report) => (
                <CardComplaint
                  key={report.id}
                  complaint={report}
                  actions={[
                    {
                      label: "Lihat Detail",
                      onClick: handleDetailClick,
                    },
                    {
                      label: "Hapus",
                      onClick: (complaint) => handleDelete(complaint.id),
                    },
                  ]}
                />
              ))}
            </ul>
            {reportHistory.length > complaintsPerPage && (
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
          onClose={() => setIsModalOpen(false)}
          complaint={selectedComplaint}
        />
      </div>
    </>
  );
};

export default ReportForm;