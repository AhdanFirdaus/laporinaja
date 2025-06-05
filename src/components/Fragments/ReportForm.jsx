import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";

const ReportForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    note: "",
    date: "",
    location: "",
    category: "",
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
    };

    setReportHistory([newReport, ...reportHistory]);

    setFormData({
      title: "",
      note: "",
      date: "",
      location: "",
      category: "",
      photo: null,
    });

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Keluhan berhasil diajukan.",
      confirmButtonColor: "#FF7F50",
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menghapus keluhan ini?",
      showCancelButton: true,
      confirmButtonColor: "#FF7F50",
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
          confirmButtonColor: "#FF7F50",
        });
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full font-[var(--font-primary)]">
        <div className="mb-4">
          <label className="block font-medium mb-1 text-[var(--color-soft-chocolate)]">
            Judul
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-[var(--color-soft-chocolate)] px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-[var(--color-soft-orange)]"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1 text-[var(--color-soft-chocolate)]">
            Catatan
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            className="w-full border border-[var(--color-soft-chocolate)] px-3 py-2 rounded-lg resize-none h-24 focus:outline-none focus:ring focus:ring-[var(--color-soft-orange)]"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1 text-[var(--color-soft-chocolate)]">
            Tanggal Kejadian
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border border-[var(--color-soft-chocolate)] px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-[var(--color-soft-orange)]"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1 text-[var(--color-soft-chocolate)]">
            Lokasi
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border border-[var(--color-soft-chocolate)] px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-[var(--color-soft-orange)]"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1 text-[var(--color-soft-chocolate)]">
            Kategori
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-[var(--color-soft-chocolate)] px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-[var(--color-soft-orange)]"
            required
          >
            <option value="">-- Pilih Kategori --</option>
            <option value="Jalan dan Trotoar">Jalan dan Trotoar</option>
            <option value="Penerangan Jalan Umum">Penerangan Jalan Umum</option>
            <option value="Saluran Air">Saluran Air</option>
            <option value="Sampah">Sampah</option>
            <option value="Keamanan dan Ketertiban">Keamanan dan Ketertiban</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        <div className="mb-10">
          <label className="block font-medium mb-1 text-[var(--color-soft-chocolate)]">
            Foto
          </label>
          <div className="flex items-center border border-[var(--color-soft-chocolate)] px-3 py-2 rounded-lg focus-within:ring focus-within:ring-[var(--color-soft-orange)]">
            <label
              htmlFor="photo-upload"
              className="border border-[var(--color-soft-chocolate)] px-3 py-2 rounded-lg cursor-pointer hover:bg-[var(--color-soft-orange)] hover:text-white transition"
            >
              Upload File
            </label>
            <span className="text-sm text-gray-600 ml-3 truncate">
              {formData.photo ? formData.photo.name : "No File Chosen"}
            </span>
            {formData.photo && (
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, photo: null });
                  document.getElementById("photo-upload").value = "";
                }}
                className="ml-3 text-red-500 hover:text-red-700 text-2xl transition-all duration-200"
                title="Hapus Foto"
              >
                <MdClose />
              </button>
            )}
          </div>
          <input
            id="photo-upload"
            type="file"
            name="photo"
            accept="image/*"
            onChange={(e) => {
              handleChange(e);
              e.target.value = "";
            }}
            className="hidden"
            required={!formData.photo}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center justify-center gap-2 text-[var(--color-soft-orange)] border border-[var(--color-soft-orange)] bg-transparent hover:bg-[var(--color-soft-orange)] hover:text-white px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            Kirim Keluhan
          </button>
        </div>
      </form>

      {/* Riwayat Keluhan */}
      <div className="mt-10 border-t pt-6">
        <h2 className="text-xl font-bold text-[var(--color-soft-chocolate)] mb-4">Riwayat Keluhan</h2>
        {reportHistory.length === 0 ? (
          <p className="text-gray-500">Belum ada keluhan yang diajukan.</p>
        ) : (
          <ul className="space-y-4">
            {reportHistory.map((report) => (
              <li
                key={report.id}
                className="border border-[var(--color-soft-chocolate)] p-4 rounded-lg bg-white shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-2xl font-semibold">{report.title}</h3>
                  <span className="text-sm text-gray-500">{report.timestamp}</span>
                </div>
                <p className="text-md text-gray-700 mb-1">
                  <span className="font-semibold">Kategori:</span> {report.category}
                </p>
                <p className="text-md text-gray-700 mb-1">
                  <span className="font-semibold">Lokasi:</span> {report.location}
                </p>
                <p className="text-md text-gray-700 mb-1">
                  <span className="font-semibold">Tanggal:</span> {report.date}
                </p>
                <p className="text-md text-gray-700 mb-3">
                  <span className="font-semibold">Catatan:</span> {report.note}
                </p>
                {report.photo && (
                  <div className="mt-2 mb-3">
                    <span className="font-semibold text-md">Foto:</span><br />
                    <img
                      src={URL.createObjectURL(report.photo)}
                      alt="Uploaded"
                      className="mt-1 max-w-xs rounded-lg"
                    />
                  </div>
                )}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200"
                    title="Hapus Keluhan"
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default ReportForm;