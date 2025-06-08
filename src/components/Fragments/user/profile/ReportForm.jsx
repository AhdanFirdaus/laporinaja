import { useState, useRef } from "react";
import Button from "../../../Elements/Button";
import Input from "../../../Elements/Input";
import Textarea from "../../../Elements/Textarea";
import Select from "../../../Elements/Select";
import InputUpload from "../../../Elements/InputUpload";
import CardComplaint from "../../../Fragments/CardComplaint";
import DetailComplaintModal from "../../../Fragments/DetailComplaintModal";
import { showConfirmation, showSuccess } from "../../../Elements/Alert";

const ReportForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    note: "",
    date: "",
    location: "",
    category: "",
    customCategory: "",
    photo: null,
  });

  const [reportHistory, setReportHistory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedData = {
      ...formData,
      timestamp: new Date().toLocaleString(),
      category:
        formData.category === "Lainnya"
          ? formData.customCategory
          : formData.category,
    };

    if (isEditing) {
      updatedData.id = editId;
      setReportHistory((prev) =>
        prev.map((report) =>
          report.id === editId ? updatedData : report
        )
      );
      showSuccess({
        text: "Keluhan berhasil diperbarui.",
      });
    } else {
      updatedData.id = Date.now();
      setReportHistory([updatedData, ...reportHistory]);
      showSuccess({
        text: "Keluhan berhasil diajukan.",
      });
    }

    setFormData({
      title: "",
      note: "",
      date: "",
      location: "",
      category: "",
      customCategory: "",
      photo: null,
    });
    setIsEditing(false);
    setEditId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEdit = (complaint) => {
    setFormData({
      title: complaint.title,
      note: complaint.note,
      date: complaint.date,
      location: complaint.location,
      category: complaint.category === complaint.customCategory ? "Lainnya" : complaint.category,
      customCategory: complaint.category === complaint.customCategory ? complaint.customCategory : "",
      photo: complaint.photo || null,
    });
    setIsEditing(true);
    setEditId(complaint.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setFormData({
      title: "",
      note: "",
      date: "",
      location: "",
      category: "",
      customCategory: "",
      photo: null,
    });
    setIsEditing(false);
    setEditId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id) => {
    const result = await showConfirmation({
      text: "Apakah Anda yakin ingin menghapus keluhan ini?",
      confirmButtonText: "Hapus",
    });

    if (result.isConfirmed) {
      setReportHistory(reportHistory.filter((report) => report.id !== id));
      showSuccess({
        title: "Dihapus!",
        text: "Keluhan telah dihapus.",
      });
    }
  };

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
          {isEditing && (
            <Button type="button" onClick={handleCancelEdit} color="red">
              Batal
            </Button>
          )}
          <Button type="submit">{isEditing ? "Simpan Perubahan" : "Kirim Keluhan"}</Button>
        </div>
      </form>

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
                    label: "Edit",
                    onClick: handleEdit,
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
