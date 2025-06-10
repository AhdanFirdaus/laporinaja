import kecamatanList from "../../public/kecamatan.json";

/**
 * Check if the input kecamatan contains a name from the kecamatan.json list (case-insensitive)
 * @param {string} kecamatanToCheck - kecamatan name from parsed OCR data
 * @returns {boolean}
 */
export function isKecamatanValid(kecamatanToCheck) {
  if (!kecamatanToCheck) {
    console.log("KECAMATAN ==> Empty or undefined input");
    return false;
  }

  // Clean input: remove non-alphanumeric chars (except spaces), normalize spaces
  const cleanedInput = kecamatanToCheck
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove junk like --, =, —
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  console.log("KECAMATAN ==> " + cleanedInput);

  if (!cleanedInput) {
    console.log("KECAMATAN ==> Cleaned input is empty");
    return false;
  }

  const isValid = kecamatanList.some((kec) => cleanedInput.includes(kec.toLowerCase()));

  if (!isValid) {
    console.log(`KECAMATAN ==> No match found for "${cleanedInput}" in kecamatanList`);
  }

  return isValid;
}