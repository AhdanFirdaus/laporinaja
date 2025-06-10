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
import checkImageSize from "../../../../helper/checkImageSize"
import { validateLocation } from "../../../../helper/validateLocation"
import { showConfirmation, showSuccess } from "../../../Elements/Alert";

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
  const [user, setUser] = useState(null); // Add state to store user

  // Fetch user and reports
  useEffect(() => {
    const fetchUserAndReports = async () => {
      try {
        // Fetch the authenticated user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Failed to fetch user or user not authenticated:", userError);
          return;
        }

        setUser(user); // Store user in state

        // Fetch reports for the authenticated user
        const { data, error } = await supabase
          .from("keluhan")
          .select("*")
          .eq("user_id", user.id)
          .order("incident_date", { ascending: false });

        if (error) {
          console.error("Failed to fetch complaints:", error);
        } else {
          console.log(data)
          setReportHistory(data);
        }
      } catch (err) {
        console.error("Error in fetchUserAndReports:", err);
      }
    };

    fetchUserAndReports();
  }, []); // Empty dependency array to run once on mount

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure user is available
    if (!user) {
      Swal.fire("Gagal", "User tidak ditemukan. Silakan login kembali.", "error");
      return;
    }

    const toast = Swal.fire({
      title: "Mengirim keluhan…",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      let photoPath = null;

      if (formData.photo) {
  const sizeCheck = checkImageSize(formData.photo);
  console.log("File size:", formData.photo.size, "bytes");


  if (!sizeCheck.valid) {
    Swal.fire({
      icon: "error",
      title: "Upload Gagal",
      text: sizeCheck.message,
    });
    return; // ⛔ stop upload if image too large
  }
  

  const ext = formData.photo.name.split(".").pop();
  const fileName = `${Date.now()}_${crypto.randomUUID()}.${ext}`;
  const filePath = `${user.id}/${fileName}`;

  const { data: storageData, error: storageError } = await supabase
    .storage
    .from("foto-keluhan")
    .upload(filePath, formData.photo);

  if (storageError) {
    console.log(storageError)
    Swal.fire({
      icon: "error",
      title: "Upload Gagal",
      text: "Terjadi kesalahan saat mengunggah foto : " + storageError.message,
    });
    return;
  }

  photoPath = storageData.path;
}

      const { data, error: dbError } = await supabase
        .from("keluhan")
        .insert({
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
          user_id: user.id,
        })
        .select("id")
        .single();

      if (dbError) throw dbError;

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

      setFormData({
        title: "",
        note: "",
        date: "",
        location: "",
        category: "",
        customCategory: "",
        photo: null,
        lan: "",
        lon: "",
      });

      toast.close();
      Swal.fire("Berhasil!", "Keluhan Anda telah dikirim.", "success");
    } catch (err) {
      console.error(err);
      toast.close();
      Swal.fire("Gagal", err.message || "Terjadi kesalahan.", "error");
    }
  };

  const handleDelete = async (id) => {
  const result = await Swal.fire({
    icon: "warning",
    title: "Konfirmasi",
    text: "Apakah Anda yakin ingin menghapus keluhan ini?",
    showCancelButton: true,
    confirmButtonColor: "#52BA5E",
    cancelButtonColor: "#d33",
    confirmButtonText: "Hapus",
    cancelButtonText: "Batal",
  });

  if (!result.isConfirmed) return;

  // 1. Find the report to get photo path
  const report = reportHistory.find((r) => r.id === id);
  const photoPath = report?.photo_path;

  try {
    // 2. Delete from DB
    const { error: deleteError } = await supabase
      .from("keluhan")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    // 3. Delete from Storage if exists
    if (photoPath) {
      const { error: storageError } = await supabase
        .storage
        .from("foto-keluhan")
        .remove([photoPath]);

      if (storageError) throw storageError;
    }

    // 4. Update UI
    setReportHistory(reportHistory.filter((r) => r.id !== id));

    Swal.fire({
      icon: "success",
      title: "Dihapus!",
      text: "Keluhan telah dihapus.",
      confirmButtonColor: "#52BA5E",
    });
  } catch (err) {
    console.error("Gagal menghapus keluhan:", err);
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: "Terjadi kesalahan saat menghapus keluhan.",
      confirmButtonColor: "#d33",
    });
  }
};

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
