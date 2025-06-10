import kecamatanList from "../../public/kecamatan.json";

/**
 * Check if a kecamatan exists in the semarang_kecamatan.json list (case-insensitive)
 * @param {string} kecamatanToCheck - kecamatan name from parsed OCR data
 * @returns {boolean}
 */
export function isKecamatanValid(kecamatanToCheck) {
  if (!kecamatanToCheck) return false;

  const lowerInput = kecamatanToCheck.toLowerCase();

  return kecamatanList.some(
    (kec) => kec.toLowerCase() === lowerInput
  );
}
