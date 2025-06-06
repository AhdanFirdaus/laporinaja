import { useState, useRef } from "react";
import Button from "../Elements/Button";
import Input from "../Elements/Input";
import Textarea from "../Elements/Textarea";
import Select from "../Elements/Select";
import InputUpload from "../Elements/InputUpload";
import CardComplaint from "../Fragments/CardComplaint";
import DetailComplaintModal from "../Fragments/DetailComplaintModal";

const ReportForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    note: "",
    date: "",
    location: "",
    category: "",
    customCategory: "", // New field for custom category input
    photo: null,
  });

  const [reportHistory, setReportHistory] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReport = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      category:
        formData.category === "Lainnya"
          ? formData.customCategory
          : formData.category, // Use customCategory if Lainnya is selected
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
    });

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Keluhan berhasil diajukan.",
      confirmButtonColor: "#52BA5E",
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menghapus keluhan ini?",
      showCancelButton: true,
      confirmButtonColor: "#52BA5E",
      cancelButtonColor: "#d33",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setReportHistory(reportHistory.filter((report) => report.id !== id));
        Swal.fire({
          icon: "success",
          title: "Dihapus!",
          text: "Keluhan telah dihapus.",
          confirmButtonColor: "#52BA5E",
        });
      }
    });
  };

  const fileInputRef = useRef(null);

  const handleClearFile = () => {
    setFormData({ ...formData, photo: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDetailClick = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const categoryOptions = [
    "Jalan dan Trotoar",
    "Penerangan Jalan Umum",
    "Saluran Air",
    "Sampah",
    "Keamanan dan Ketertiban",
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
          label="Lokasi"
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
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Kirim Keluhan</Button>
        </div>
      </form>

      {/* Riwayat Keluhan */}
      <div className="mt-12 border-t pt-8 bg-gray-50">
        <h2 className="text-3xl font-bold font-second text-soft-orange mb-6 tracking-tight">
          Riwayat Keluhan
        </h2>
      {reportHistory.length === 0 ? (
        <p className="text-gray-500 text-lg italic text-center py-8">
          Belum ada keluhan yang diajukan.
        </p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          {reportHistory.map((report) => (
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
