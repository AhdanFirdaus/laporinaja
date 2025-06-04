import React, { useState } from "react";
import { MdClose } from "react-icons/md";

const ReportForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    note: "",
    date: "",
    location: "",
    category: "",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Keluhan berhasil diajukan!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full font-[var(--font-primary)]"
    >

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
      className="border border-[var(--color-soft-chocolate)] px-3 py-2 rounded-lg focus-within:ring focus-within:ring-[var(--color-soft-orange)]"
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
    e.target.value;
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
  );
};

export default ReportForm;
