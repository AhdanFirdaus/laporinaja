import kecamatanList from "../../public/kecamatan.json";

/**
 * @param {string} kecamatanToCheck
 * @returns {boolean}
 */
export function isKecamatanValid(kecamatanToCheck) {
  if (!kecamatanToCheck) {
    return false;
  }

  const cleanedInput = kecamatanToCheck
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  if (!cleanedInput) {
    return false;
  }

  const isValid = kecamatanList.some((kec) =>
    cleanedInput.includes(kec.toLowerCase())
  );

  if (!isValid) {
    return false;
  }

  return isValid;
}