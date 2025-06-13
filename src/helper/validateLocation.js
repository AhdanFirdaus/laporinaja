import kecamatanList from "../../public/kecamatan.json";

export async function validateLocation(lat, lon) {
  if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
    return {
      valid: false,
      reason: "Latitude and longitude must be valid numbers.",
    };
  }

  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return {
      valid: false,
      reason:
        "Latitude must be between -90 and 90, and longitude between -180 and 180.",
    };
  }

  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "LaporinAja/1.0 (contact@laporinaja.com)",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch location: ${response.status}`);
    }

    const data = await response.json();

    if (!data.address) {
      return {
        valid: false,
        reason: "No address data found for the provided coordinates.",
      };
    }

    const address = data.address;
    const kecamatan =
      address.city_district ||
      address.suburb ||
      address.town ||
      address.village ||
      null;

    if (!kecamatan) {
      return {
        valid: false,
        reason: "Kecamatan not found in address data.",
      };
    }

    const isValid = kecamatanList.some(
      (item) => item.toLowerCase() === kecamatan.toLowerCase()
    );

    return {
      valid: isValid,
      kecamatan,
      fullAddress: data.display_name || "Unknown address",
      reason: isValid
        ? "Valid location"
        : `Kecamatan "${kecamatan}" not allowed`,
    };
  } catch (error) {
    return {
      valid: false,
      reason: `Error validating location: ${error.message}`,
    };
  }
}