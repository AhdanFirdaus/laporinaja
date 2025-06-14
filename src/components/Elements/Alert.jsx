import Swal from "sweetalert2";

export const showConfirmation = ({
  title = "Konfirmasi",
  text = "Apakah Anda yakin?",
  confirmButtonText = "Ya",
  cancelButtonText = "Batal",
  confirmButtonColor = "#52BA5E",
  cancelButtonColor = "#d33",
  icon = "warning",
}) => {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonColor,
    confirmButtonText,
    cancelButtonText,
  });
};

export const showSuccess = ({
  title = "Berhasil!",
  text = "",
  confirmButtonColor = "#52BA5E",
}) => {
  return Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonColor,
  });
};

export const showError = ({
  title = "Gagal!",
  text = "Terjadi kesalahan.",
  confirmButtonColor = "#d33",
}) => {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor,
  });
};

export const showSend = ({
  title = "",
  text = "...",
  timer = 3000,
  showConfirmButton = false,
}) => {
  return Swal.fire({
    icon: "info",
    title,
    text,
    timer,
    showConfirmButton,
  });
};