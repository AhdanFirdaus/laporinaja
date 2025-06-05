import Button from "../Elements/Button";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router";

function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 mt-20">
      {/* Call-to-Action Section */}
      <div className="bg-soft-orange text-white rounded-xl mx-7 md:mx-24 p-8 md:p-12 shadow-lg -translate-y-10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">
          Saatnya Berani Speak Up!
        </h2>
        <p className="mb-4 text-sm md:text-base">
          Laporkan segala bentuk kerusakan fasilitas umum di Semarang dengan
          mudah melalui{" "}
          <strong className="font-second text-2xl">laporinaja</strong>.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button color="white" txtcolor="text-soft-orange">
            Hubungi Kami
          </Button>
          <Button className="flex items-center gap-2 hover:underline">
            Lihat cara pemakaian <FiArrowRight size={14} />
          </Button>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="text-center md:text-left px-4 md:px-24 py-10 border-t border-gray-300">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          <div>
            <h1 className="text-3xl font-bold font-second text-soft-orange">
              laporinaja.
            </h1>
            <p className="text-sm mt-2">
              Untuk Semarang yang lebih baik dan tertib.
            </p>
            <p className="mt-1 text-xs text-gray-700">
              © 2025 laporinaja. All rights reserved.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <Link to="#tentang" className="hover:underline">
              Tentang
            </Link>
            <Link to="#dampak" className="hover:underline">
              Dampak
            </Link>
            <Link to="#carapemakaian" className="hover:underline">
              Cara Pemakaian
            </Link>
            <Link to="#tanyajawab" className="hover:underline">
              Tanya Jawab
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
