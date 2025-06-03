const PrivacyPolicy = () => (
  <div className="text-gray-800">
    <p className="mb-4">
      Privasi Anda adalah prioritas kami. Aplikasi ini dirancang untuk menjaga kerahasiaan data pribadi setiap warga yang melaporkan kendala fasilitas umum di wilayah Kota Semarang.
    </p>

    <h3 className="text-lg font-semibold mt-6 mb-2">1. Informasi yang Kami Kumpulkan</h3>
    <p className="mb-4">
      Kami mengumpulkan informasi dari KTP yang Anda scan setelah login, termasuk NIK, nama lengkap, jenis kelamin, tanggal lahir, dan alamat domisili (RT/RW, kelurahan, kecamatan). Selain itu, kami menyimpan laporan kendala yang Anda buat berupa judul, catatan, lokasi, tanggal kejadian, kategori, dan foto.
    </p>

    <h3 className="text-lg font-semibold mt-6 mb-2">2. Penggunaan Informasi</h3>
    <p className="mb-4">
      Data Anda digunakan untuk memverifikasi bahwa Anda adalah warga Kota Semarang yang sah, serta untuk menampilkan informasi profil. Setiap pelaporan kendala akan mengenkripsi identitas Anda agar tidak dapat dilacak secara langsung oleh pengguna lain. Data juga digunakan sebagai bahan evaluasi kondisi lingkungan kecamatan Anda.
    </p>

    <h3 className="text-lg font-semibold mt-6 mb-2">3. Perlindungan dan Enkripsi Data</h3>
    <p className="mb-4">
      Identitas Anda akan disamarkan dalam bentuk ID terenkripsi ketika laporan ditampilkan ke publik. Kami menggunakan protokol keamanan yang memadai untuk menyimpan dan memproses data secara aman.
    </p>

    <h3 className="text-lg font-semibold mt-6 mb-2">4. Akses dan Verifikasi</h3>
    <p className="mb-4">
      Hanya Anda dan pihak verifikator dari petugas kecamatan yang memiliki akses terbatas terhadap data asli untuk keperluan validasi laporan secara langsung.
    </p>

    <h3 className="text-lg font-semibold mt-6 mb-2">5. Perubahan Kebijakan</h3>
    <p className="mb-4">
      Kebijakan ini dapat diperbarui sewaktu-waktu. Setiap perubahan akan diumumkan melalui halaman utama aplikasi.
    </p>
  </div>
);

export default PrivacyPolicy;
