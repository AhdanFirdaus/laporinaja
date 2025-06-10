export function parseKtpText(text) {
  // Normalize lines, trim spaces, and remove empty lines
  const lines = text
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  // Initialize result object with all desired fields
  const result = {
    nama: "",
    nik: "",
    jenisKelamin: "",
    kelurahan: "",
    tanggalLahir: "",
    tempatLahir: "",
    rtRw: "",
    kecamatan: "",
    agama: "", // Optional fields
    statusPerkawinan: "",
    pekerjaan: "",
    kewarganegaraan: "",
    berlakuHingga: ""
  };

  // Helper function to extract value after a colon
  const getValueAfterColon = (line, pattern) => {
    if (pattern.test(line)) {
      const match = line.match(/:(.*)/);
      return match ? match[1].trim() : "";
    }
    return "";
  };

  // Iterate through lines to find values
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // NIK - handle cases where NIK is on the same line or next line
    if (/NIK\s*:/i.test(line)) {
      result.nik = getValueAfterColon(line, /NIK\s*:/i);
      if (!result.nik && lines[i + 1]) {
        // Check next line if NIK is not on the same line
        result.nik = lines[i + 1].replace(/\s/g, "");
      }
      // Validate NIK (16 digits)
      if (result.nik && !/^\d{16}$/.test(result.nik)) {
        result.nik = ""; // Reset if invalid
      }
    }

    // Nama
    if (/Nama\s*:/i.test(line)) {
      result.nama = getValueAfterColon(line, /Nama\s*:/i);
    }

    // Jenis Kelamin
    if (/Jenis Kelamin\s*:/i.test(line)) {
      result.jenisKelamin = getValueAfterColon(line, /Jenis Kelamin\s*:/i).split(/\s+/)[0]; // Take first word (e.g., "PEREMPUAN")
    }

    // Kelurahan (handle variations like Kel/Desa, Kel., etc.)
    if (/(Kel(\/Desa|urahan)?\.?)\s*:/i.test(line)) {
      result.kelurahan = getValueAfterColon(line, /(Kel(\/Desa|urahan)?\.?)\s*:/i);
    }

    // Tempat/Tgl Lahir - extract both place and date
    if (/Tempat\/Tgl Lahir\s*:/i.test(line)) {
      const parts = getValueAfterColon(line, /Tempat\/Tgl Lahir\s*:/i);
      // Split on last occurrence of space before date (assuming DD-MM-YYYY or DD/MM/YYYY)
      const dateMatch = parts.match(/(\d{2}[-\/]\d{2}[-\/]\d{4})$/);
      if (dateMatch) {
        result.tanggalLahir = dateMatch[0];
        // Extract place (everything before the date)
        result.tempatLahir = parts.replace(dateMatch[0], "").trim();
      }
    }

    // Rt/Rw
    if (/Rt\/Rw\s*:/i.test(line)) {
      result.rtRw = getValueAfterColon(line, /Rt\/Rw\s*:/i);
    }

    // Kecamatan
    if (/Kecamatan\s*:/i.test(line)) {
      result.kecamatan = getValueAfterColon(line, /Kecamatan\s*:/i);
    }

    // Additional fields
    if (/Agama\s*:/i.test(line)) {
      result.agama = getValueAfterColon(line, /Agama\s*:/i);
    }
    if (/Status Perkawinan\s*:/i.test(line)) {
      result.statusPerkawinan = getValueAfterColon(line, /Status Perkawinan\s*:/i);
    }
    if (/Pekerjaan\s*:/i.test(line)) {
      result.pekerjaan = getValueAfterColon(line, /Pekerjaan\s*:/i);
    }
    if (/Kewarganegaraan\s*:/i.test(line)) {
      result.kewarganegaraan = getValueAfterColon(line, /Kewarganegaraan\s*:/i);
    }
    if (/Berlaku Hingga\s*:/i.test(line)) {
      result.berlakuHingga = getValueAfterColon(line, /Berlaku Hingga\s*:/i);
    }
  }

  return result;
}