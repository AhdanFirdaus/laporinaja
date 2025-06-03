import { useState } from "react";
import Button from "../Elements/Button";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3 md:px-6 md:py-3 border rounded-full mt-4 max-w-[90%] bg-white">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-soft-orange font-semibold text-2xl">
            <Link to="/" className="font-bold font-second">
              LaporinAja
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/#tentang" className="text-gray-700 hover:text-soft-orange">
              Tentang
            </Link>
            <Link to="/#dampak" className="text-gray-700 hover:text-soft-orange">
              Dampak
            </Link>
            <Link to="/carapemakaian" className="text-gray-700 hover:text-soft-orange">
              Cara Pemakaian
            </Link>
            <Link to="/#tanyajawab" className="text-gray-700 hover:text-soft-orange">
              Tanya Jawab
            </Link>
            <Button className="font-bold">
              Masuk
            </Button>
          </div>

          {/* Hamburger for Mobile */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full mt-2 mx-7 sm:mx-9 bg-white border rounded-lg shadow-lg z-50">
            <div className="flex flex-col gap-4 p-4">
              <Link
                to="/#tentang"
                className="text-gray-700 hover:text-soft-orange"
                onClick={() => setIsOpen(false)}
              >
                Tentang
              </Link>
              <Link
                to="/#dampak"
                className="text-gray-700 hover:text-soft-orange"
                onClick={() => setIsOpen(false)}
              >
                Dampak
              </Link>
              <Link
                to="/carapemakaian"
                className="text-gray-700 hover:text-soft-orange"
                onClick={() => setIsOpen(false)}
              >
                Cara Pemakaian
              </Link>
              <Link
                to="/#tanyajawab"
                className="text-gray-700 hover:text-soft-orange"
                onClick={() => setIsOpen(false)}
              >
                Tanya Jawab
              </Link>
              <Button color="rose" className="font-bold w-full text-center">
                Masuk
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
