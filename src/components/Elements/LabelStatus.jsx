const LabelStatus = ({ label = "Menunggu" }) => {
  const baseClass = "text-sm font-medium py-1 px-3 rounded-full inline-block";

  const labelClass =
    label === "Menunggu"
      ? "bg-yellow-100 text-yellow-800"
      : label === "Proses"
      ? "bg-blue-100 text-blue-800"
      : label === "Selesai"
      ? "bg-green-100 text-green-800"
      : label === "Ditolak"
      ? "bg-red-100 text-red-800"
      : "bg-gray-100 text-gray-800";

  return <span className={`${baseClass} ${labelClass}`}>{label}</span>;
};

export default LabelStatus;