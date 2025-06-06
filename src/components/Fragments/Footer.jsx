import Button from "../Elements/Button";
import { FiArrowRight } from "react-icons/fi";
import { scroller } from "react-scroll";
import { useLocation, useNavigate } from "react-router";

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleScroll = (section) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        scroller.scrollTo(section, {
          smooth: true,
          duration: 500,
          offset: -80,
        });
      }, 100);
    } else {
      scroller.scrollTo(section, {
        smooth: true,
        duration: 500,
        offset: -80,
      });
    }
  };

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
          <strong className="font-second text-2xl">LaporinAja</strong>.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button
            color="white"
            txtcolor="text-soft-orange"
            href="https://wa.me/62895339023888?text=Halo%20Tim%20LaporinAja%F0%9F%91%8B%2C%0A%0ASaya%20memiliki%20pertanyaan%20terkait%3A%0A%0Apesan%0A%0ATerima%20kasih%20%F0%9F%99%8F."
            target="_blank"
          >
            Hubungi Kami
          </Button>
          <Button
            onClick={() => handleScroll("carapemakaian")}
            className="group flex items-center gap-2 hover:underline"
          >
            Lihat cara pemakaian{" "}
            <FiArrowRight
              size={14}
              className="transform transition-transform duration-200 group-hover:-rotate-45"
            />
          </Button>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="text-center md:text-left px-4 md:px-24 py-10 border-t border-gray-300">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          {/* Brand & Info */}
          <div>
            <h1 className="text-3xl font-bold font-second text-soft-orange">
              LaporinAja
            </h1>
            <p className="text-sm mt-2">
              Untuk Semarang yang lebih baik dan tertib.
            </p>
            <p className="mt-1 text-xs text-gray-700">
              © 2025 laporinaja. All rights reserved.
            </p>
          </div>

          {/* Navigasi */}
          <div className="grid grid-cols-2 gap-4 text-sm justify-center mx-auto md:mx-0 text-left">
            <button
              onClick={() => handleScroll("tentang")}
              className="hover:underline text-left cursor-pointer"
            >
              Tentang
            </button>
            <button
              onClick={() => handleScroll("dampak")}
              className="hover:underline text-left cursor-pointer"
            >
              Dampak
            </button>
            <button
              onClick={() => handleScroll("carapemakaian")}
              className="hover:underline text-left cursor-pointer"
            >
              Cara Pemakaian
            </button>
            <button
              onClick={() => handleScroll("tanyajawab")}
              className="hover:underline text-left cursor-pointer"
            >
              Tanya Jawab
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;