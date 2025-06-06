import { useState, useRef } from "react";
import Button from "../Elements/Button";
import Input from "../Elements/Input";
import Textarea from "../Elements/Textarea";
import Select from "../Elements/Select";
import InputUpload from "../Elements/InputUpload";
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

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearFile = () => {
    setFormData({ ...formData, photo: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
              <li
                key={report.id}
                className="border border-gray-200 p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="space-y-4">
                  {/* Timestamp at Top-Right */}
                  <div className="flex justify-end">
                    <span className="text-sm text-gray-400">
                      {report.timestamp}
                    </span>
                  </div>
                  {/* Title with Truncation */}
                  <h3 className="text-xl font-semibold text-gray-800 line-clamp-2 break-all">
                    {report.title}
                  </h3>
                  {/* Content and Image in Flex Row */}
                  <div className="flex flex-row gap-6">
                    <div className="flex-1 space-y-2 text-gray-600">
                      <p className="text-md">
                        <span className="font-medium">Kategori:</span>{" "}
                        <span className="line-clamp-1 break-all">
                          {report.category}
                        </span>
                      </p>
                      <p className="text-md">
                        <span className="font-medium">Lokasi:</span>{" "}
                        <span className="line-clamp-2 break-all">
                          {report.location}
                        </span>
                      </p>
                      <p className="text-md">
                        <span className="font-medium">Tanggal:</span>{" "}
                        <span className="line-clamp-1">{report.date}</span>
                      </p>
                      <p className="text-md">
                        <span className="font-medium">Catatan:</span>{" "}
                        <span className="line-clamp-3 break-all">
                          {report.note}
                        </span>
                      </p>
                    </div>
                    {/* Right Section: Image */}
                    {report.photo && (
                      <div className="w-1/3 flex-shrink-0">
                        <span className="font-medium text-md text-gray-600 block mb-2">
                          Foto:
                        </span>
                        <img
                          src={URL.createObjectURL(report.photo)}
                          alt="Uploaded"
                          className="w-full h-48 rounded-lg object-cover"
                        />
                      </div>
                    )}
                  </div>
                  {/* Buttons Section */}
                  <div className="flex justify-end mt-4 space-x-4">
                    <Button color="blue">Details</Button>
                    <Button
                      color="red"
                      onClick={() => handleDelete(report.id)}
                      title="Hapus Keluhan"
                    >
                      Hapus
                    </Button>
                  </div>
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
