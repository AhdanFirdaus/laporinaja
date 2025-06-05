import { useState } from "react";
import Button from "../Elements/Button";
import { FiMenu, FiX } from "react-icons/fi";
import { Link as RouterLink } from "react-router";
import { Link as ScrollLink } from "react-scroll";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3 md:px-6 md:py-3 border rounded-full mt-4 max-w-[90%] bg-white">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-soft-orange font-semibold text-2xl">
            <RouterLink to="/" className="font-bold font-second">
              LaporinAja
            </RouterLink>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <ScrollLink
              to="tentang"
              smooth={true}
              duration={500}
              offset={-80} // Adjust based on navbar height
              className="text-gray-700 hover:text-soft-orange cursor-pointer"
            >
              Tentang
            </ScrollLink>
            <ScrollLink
              to="dampak"
              smooth={true}
              duration={500}
              offset={-80}
              className="text-gray-700 hover:text-soft-orange cursor-pointer"
            >
              Dampak
            </ScrollLink>
            <ScrollLink
              to="carapemakaian"
              smooth={true}
              duration={500}
              offset={-80}
              className="text-gray-700 hover:text-soft-orange cursor-pointer"
            >
              Cara Pemakaian
            </ScrollLink>
            <ScrollLink
              to="tanyajawab"
              smooth={true}
              duration={500}
              offset={-80}
              className="text-gray-700 hover:text-soft-orange cursor-pointer"
            >
              Tanya Jawab
            </ScrollLink>
            <Button className="font-bold">Masuk</Button>
          </div>

          {/* Hamburger for Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="text-gray-700"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full mt-2 mx-7 sm:mx-9 bg-white border rounded-lg shadow-lg z-50">
            <div className="flex flex-col gap-4 p-4">
              <ScrollLink
                to="tentang"
                smooth={true}
                duration={500}
                offset={-80}
                className="text-gray-700 hover:text-soft-orange cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Tentang
              </ScrollLink>
              <ScrollLink
                to="dampak"
                smooth={true}
                duration={500}
                offset={-80}
                className="text-gray-700 hover:text-soft-orange cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Dampak
              </ScrollLink>
              <ScrollLink
                to="carapemakaian"
                smooth={true}
                duration={500}
                offset={-80}
                className="text-gray-700 hover:text-soft-orange cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Cara Pemakaian
              </ScrollLink>
              <ScrollLink
                to="tanyajawab"
                smooth={true}
                duration={500}
                offset={-80}
                className="text-gray-700 hover:text-soft-orange cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Tanya Jawab
              </ScrollLink>
              <Button
                color="rose"
                className="font-bold w-full text-center"
                onClick={() => setIsOpen(false)}
              >
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