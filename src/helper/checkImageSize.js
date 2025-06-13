const MAX_FILE_SIZE_MB = 1;

export default function checkImageSize(file) {
  const maxSize = MAX_FILE_SIZE_MB * 1024 * 1024;

  if (file.size > maxSize) {
    return {
      valid: false,
      message: `Ukuran gambar terlalu besar. Maksimum ${MAX_FILE_SIZE_MB}MB.`,
    };
  }

  return { valid: true };
}