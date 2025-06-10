import { useState, useRef, useEffect } from "react";
import Button from "../../../Elements/Button";
import Input from "../../../Elements/Input";
import Textarea from "../../../Elements/Textarea";
import Select from "../../../Elements/Select";
import InputUpload from "../../../Elements/InputUpload";
import CardComplaint from "../../../Fragments/CardComplaint";
import DetailComplaintModal from "../../../Fragments/DetailComplaintModal";
import Swal from "sweetalert2";
import supabase from "../../../../../supabaseClient";

const ReportForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    note: "",
    date: "",
    location: "",
    category: "",
    customCategory: "", // New field for custom category input
  });

  const [reportHistory, setReportHistory] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Menampilkan “loading” toast
  const toast = Swal.fire({
    title: "Mengirim keluhan…",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  try {
    const {
  data: { user },
} = await supabase.auth.getUser();
    /** 1. Upload fotonya (optional) */
    let photoPath = null;

    if (formData.photo) {
      // Generate nama file unik, contoh 162738192_photo.jpg
      const ext = formData.photo.name.split(".").pop();
const fileName = `${Date.now()}_${crypto.randomUUID()}.${ext}`;
const filePath = `${user.id}/${fileName}`; // ✅ path includes user ID

const { data: storageData, error: storageError } = await supabase
  .storage
  .from("foto-keluhan")
  .upload(filePath, formData.photo);

if (storageError) throw storageError;

photoPath = storageData.path; 

    }

    /** 2. Insert data ke ‘keluhan’ table */
    
    
    const { data, error: dbError } = await supabase.from("keluhan").insert({
  title: formData.title,
  note: formData.note,
  incident_date: formData.date,
  location: formData.location,
  category:
    formData.category === "Lainnya"
      ? formData.customCategory
      : formData.category,
  custom_category:
    formData.category === "Lainnya" ? formData.customCategory : null,
  photo_path: photoPath,
  status: "waiting",
  user_id: user.id, // foreign key ke user id table
})
.select("id")
.single()
;

    if (dbError) throw dbError;

    /** 3. Update local ui */
    const newReport = {
      ...formData,
      id: data?.id,
      timestamp: new Date().toLocaleString(),
      category:
        formData.category === "Lainnya"
          ? formData.customCategory
          : formData.category,
      photo_path: photoPath,
      status: "waiting",
    };
    setReportHistory([newReport, ...reportHistory]);

    /** 4. Reset form */
    setFormData({
      title: "",
      note: "",
      date: "",
      location: "",
      category: "",
      customCategory: "",
      photo: null,
    });

    toast.close();
    Swal.fire("Berhasil!", "Keluhan Anda telah dikirim.", "success");
  } catch (err) {
    console.error(err);
    toast.close();
    Swal.fire("Gagal", err.message || "Terjadi kesalahan.", "error");
  }
};


  const handleDelete = (id) => {
    console.log(id)
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