function cleanString(str) {
  return str.replace(/[^a-zA-Z0-9 \/\-\.,]/g, "");
}

export function parseKtpText(text) {
  const result = {
    nama: "",
    nik: "",
    jenisKelamin: "",
    kelurahan: "",
    tanggalLahir: "",
    tempatLahir: "",
    rtRw: "",
    kecamatan: "",
    agama: "",
    statusPerkawinan: "",
    pekerjaan: "",
    kewarganegaraan: "",
    berlakuHingga: "",
  };

  const lines = text.split("\n");

  for (let line of lines) {
    line = line.trim();
    if (line.includes(":")) {
      const [label, ...valueParts] = line.split(":");
      const labelTrimmed = label.trim().toLowerCase();
      const value = valueParts.join(":").trim();

      switch (labelTrimmed) {
        case "nik":
          result.nik = value.replace(/\D/g, "");
          break;
        case "nama":
          result.nama = cleanString(value);
          break;
        case "tempat/tgl lahir":
          const birthMatch = value.match(/([0-9]{2}-[0-9]{2}-[0-9]{4})/);
          if (birthMatch) {
            result.tanggalLahir = birthMatch[1];
          }
          const tempat = value.replace(/[^a-zA-Z\s]/g, "").replace(/\bGol\b.*$/, "").trim();
          result.tempatLahir = cleanString(tempat);
          break;
        case "jenis kelamin":
          result.jenisKelamin = cleanString(value.split(" ")[0]);
          break;
        case "alamat":
          result.alamat = cleanString(value);
          break;
        case "rt/rw":
          result.rtRw = cleanString(value);
          break;
        case "kel/desa":
          result.kelurahan = cleanString(value);
          break;
        case "kecamatan":
          result.kecamatan = cleanString(value);
          break;
        case "agama":
          result.agama = cleanString(value);
          break;
        case "status perkawinan":
          result.statusPerkawinan = cleanString(value);
          break;
        case "pekerjaan":
          result.pekerjaan = cleanString(value);
          break;
        case "kewarganegaraan":
          result.kewarganegaraan = cleanString(value);
          break;
        case "berlaku hingga":
          result.berlakuHingga = cleanString(value);
          break;
      }
    } else {
      if (/^\d{16}$/.test(line)) {
        result.nik = line;
      }
    }
  }

  return result;
}