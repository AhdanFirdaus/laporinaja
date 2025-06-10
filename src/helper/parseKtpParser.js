export function parseKtpText(text, options = { debug: false }) {
  // Normalize input: remove junk characters, normalize spaces, convert to uppercase
  const cleanText = text
    .replace(/[^a-zA-Z0-9\s:\/-]/g, '') // Remove special chars (e.g., ~~, =, —, f§)
    .replace(/\s+/g, ' ') // Normalize multiple spaces
    .toUpperCase()
    .trim();

  // Split into lines, trim, and filter empty lines
  const lines = cleanText
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  // Initialize result object
  const result = {
    nama: '',
    nik: '',
    jenisKelamin: '',
    kelurahan: '',
    tanggalLahir: '',
    tempatLahir: '',
    rtRw: '',
    kecamatan: '',
    agama: '',
    statusPerkawinan: '',
    pekerjaan: '',
    kewarganegaraan: '',
    berlakuHingga: '',
  };

  // Validation rules
  const validJenisKelamin = ['LAKI-LAKI', 'PEREMPUAN'];
  const validAgama = ['ISLAM', 'KRISTEN', 'KATHOLIK', 'HINDU', 'BUDDHA', 'KONGHUCU'];
  const validStatusPerkawinan = ['BELUM KAWIN', 'KAWIN', 'CERAI HIDUP', 'CERAI MATI'];
  const validKewarganegaraan = ['WNI', 'WNA'];

  // Helper to clean and validate values
  const cleanValue = (value) => {
    if (value === undefined || value === null) return '';
    return value.replace(/\s+/g, ' ').trim();
  };

  // Helper to extract value after a pattern
  const getValueAfterPattern = (line, pattern) => {
    const regex = new RegExp(`${pattern}\\s*:?\\s*(.*?)\\s*$`, 'i'); // Non-greedy match
    const match = line.match(regex);
    if (!match || match[1] === undefined) {
      options.debug && console.log(`[DEBUG] No match for pattern ${pattern} in line: ${line}`);
      return '';
    }
    return cleanValue(match[1]);
  };

  // Helper to correct OCR errors
  const correctOcrErrors = (value) => {
    return value
      .replace(/[O0]/g, '0') // Replace O with 0
      .replace(/[I1]/g, '1') // Replace I with 1
      .replace(/[^\w\s]/g, ''); // Remove remaining junk
  };

  // Helper to validate date format
  const isValidDate = (date) => {
    const regex = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/;
    if (!regex.test(date)) return false;
    const [, day, month, year] = date.match(regex);
    const d = new Date(`${year}-${month}-${day}`);
    return d.getDate() === parseInt(day) && d.getMonth() + 1 === parseInt(month) && d.getFullYear() === parseInt(year);
  };

  // Debug logger
  const logDebug = (message) => {
    if (options.debug) console.log(`[DEBUG] ${message}`);
  };

  // Iterate through lines
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // NIK
    if (/NIK/i.test(line)) {
      let nik = getValueAfterPattern(line, 'NIK');
      if (!nik && lines[i + 1]) {
        nik = cleanValue(lines[i + 1]);
      }
      nik = correctOcrErrors(nik);
      if (/^\d{16}$/.test(nik)) {
        result.nik = nik;
      } else {
        logDebug(`Invalid NIK: ${nik}`);
      }
    }

    // Nama
    if (/NAMA/i.test(line)) {
      let nama = getValueAfterPattern(line, 'NAMA');
      // Remove trailing junk like "= 2"
      nama = nama.replace(/\s*[=0-9].*$/, '');
      result.nama = cleanValue(nama);
    }

    // Jenis Kelamin
    if (/JENIS\s*KELAMIN/i.test(line)) {
      const value = getValueAfterPattern(line, 'JENIS\\s*KELAMIN').split(' ')[0];
      if (validJenisKelamin.includes(value)) {
        result.jenisKelamin = value;
      } else {
        logDebug(`Invalid Jenis Kelamin: ${value}`);
      }
    }

    // Kelurahan
    if (/(KEL(\/DESA|URAHAN)?\.?)/i.test(line)) {
      let kelurahan = getValueAfterPattern(line, 'KEL(\/DESA|URAHAN)?\\.?');
      // Remove trailing junk like "-- -- --"
      kelurahan = kelurahan.replace(/\s*[-=].*$/, '');
      result.kelurahan = cleanValue(kelurahan);
    }

    // Tempat/Tgl Lahir
    if (/TEMPAT\/TGL\s*LAHIR/i.test(line)) {
      const value = getValueAfterPattern(line, 'TEMPAT\/TGL\\s*LAHIR');
      const dateMatch = value.match(/(\d{2}[-\/]\d{2}[-\/]\d{4})$/);
      if (dateMatch && isValidDate(dateMatch[0])) {
        result.tanggalLahir = dateMatch[0];
        result.tempatLahir = cleanValue(value.replace(dateMatch[0], ''));
      } else {
        logDebug(`Invalid Tempat/Tgl Lahir: ${value}`);
      }
    }

    // RT/RW
    if (/RT\/RW/i.test(line)) {
      let value = getValueAfterPattern(line, 'RT\/RW');
      // Remove trailing junk like "ape f§ -"
      value = value.replace(/\s*[A-Z].*$/, '');
      if (/^\d{3}\/\d{3}$/.test(value)) {
        result.rtRw = value;
      } else {
        logDebug(`Invalid RT/RW: ${value}`);
      }
    }

    // Kecamatan
    if (/KECAMATAN/i.test(line)) {
      let kecamatan = getValueAfterPattern(line, 'KECAMATAN');
      // Remove trailing junk like "— — —"
      kecamatan = kecamatan.replace(/\s*[-=].*$/, '');
      result.kecamatan = cleanValue(kecamatan);
    }

    // Agama
    if (/AGAMA/i.test(line)) {
      const value = getValueAfterPattern(line, 'AGAMA');
      if (validAgama.includes(value)) {
        result.agama = value;
      } else {
        logDebug(`Invalid Agama: ${value}`);
      }
    }

    // Status Perkawinan
    if (/STATUS\s*PERKAWINAN/i.test(line)) {
      const value = getValueAfterPattern(line, 'STATUS\\s*PERKAWINAN');
      if (validStatusPerkawinan.includes(value)) {
        result.statusPerkawinan = value;
      } else {
        logDebug(`Invalid Status Perkawinan: ${value}`);
      }
    }

    // Pekerjaan
    if (/PEKERJAAN/i.test(line)) {
      let pekerjaan = getValueAfterPattern(line, 'PEKERJAAN');
      // Remove trailing junk like "= 18-09-2016"
      pekerjaan = pekerjaan.replace(/\s*[=0-9].*$/, '');
      result.pekerjaan = cleanValue(pekerjaan);
    }

    // Kewarganegaraan
    if (/KEWARGANEGARAAN/i.test(line)) {
      const value = getValueAfterPattern(line, 'KEWARGANEGARAAN');
      if (validKewarganegaraan.includes(value)) {
        result.kewarganegaraan = value;
      } else {
        logDebug(`Invalid Kewarganegaraan: ${value}`);
      }
    }

    // Berlaku Hingga
    if (/BERLAKU\s*HINGGA/i.test(line)) {
      const value = getValueAfterPattern(line, 'BERLAKU\\s*HINGGA');
      if (isValidDate(value) || value === 'SEUMUR HIDUP') {
        result.berlakuHingga = value;
      } else {
        logDebug(`Invalid Berlaku Hingga: ${value}`);
      }
    }
  }

  return result;
}