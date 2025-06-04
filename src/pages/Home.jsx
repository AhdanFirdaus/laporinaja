import Navbar from "../components/Fragments/Navbar";
import Button from "../components/Elements/Button";
import { motion } from "framer-motion";
import ReactCompareImage from "react-compare-image";
import AcceptTask from "../assets/accepttask.svg";
import { useState, useEffect } from "react";
import Img1 from "../assets/img1.jpg";
import Img2 from "../assets/img2.jpg";
import Img3 from "../assets/img3.jpg";
import Img4 from "../assets/img4.jpg";
import Before1 from "../assets/Before1.png";
import After1 from "../assets/After1.png";
import Before2 from "../assets/Before2.png";
import After2 from "../assets/After2.png";

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-26 lg:pt-0">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between max-w-[90%]">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 leading-tight mb-4">
              Lorem, ipsum dolor sit amet consectetur adipisicing.
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
              modi reiciendis dolor repellendus reprehenderit earum voluptatum
              quibusdam iure tenetur possimus?
            </p>
            <Button className="text-lg">Mulai</Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="lg:w-1/2 flex justify-end"
          >
            <div className="relative">
              <div className="w-64 h-54 sm:w-96 sm:h-80 lg:w-[450px] lg:h-[420px] flex items-center justify-center">
                <img src={AcceptTask} alt="website" className="w-full h-auto" />
              </div>
              <motion.div
                className="absolute -top-5 -left-5 w-10 h-10 bg-soft-orange rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <motion.div
                className="absolute bottom-0 right-0 w-8 h-8 bg-soft-orange rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* tentang section */}
      <section id="tentang" className="py-12 sm:py-16 bg-pale-white-400/30">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between max-w-[90%]">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <div className="relative w-full">
              <div className="relative w-full h-64 sm:h-80 md:h-96">
                {/* Main image (left) */}
                {[Img4, Img3, Img2, Img1].map((src, index) => (
                  <motion.img
                    key={index}
                    src={src}
                    alt={`Team ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg z-10 shadow-md"
                    initial={{ opacity: 0, rotate: 5 }}
                    animate={{
                      opacity: index === currentImage ? 1 : 0,
                      rotate: index === currentImage ? 0 : 5,
                    }}
                    transition={{ duration: 0.5 }}
                    style={{
                      display: index === currentImage ? "block" : "none",
                    }}
                  />
                ))}
                {/* Bottom-right image */}
                {[Img1, Img2, Img3, Img4].map((src, index) => (
                  <motion.img
                    key={index + 4}
                    src={src}
                    alt={`Team ${index + 5}`}
                    className="absolute bottom-0 right-0 w-1/2 h-2/3 object-cover rounded-lg z-20 shadow-md hidden lg:block"
                    initial={{ opacity: 0, rotate: -5 }}
                    animate={{
                      opacity: index === currentImage ? 1 : 0,
                      rotate: index === currentImage ? 0 : -5,
                    }}
                    transition={{ duration: 0.5 }}
                    style={{
                      display: index === currentImage ? "block" : "none",
                    }}
                  />
                ))}
              </div>
              <div className="absolute bottom-[-5%] left-[5%] sm:bottom-[-10%] sm:left-[10%] w-1/3 sm:w-1/4 md:w-1/3 bg-soft-orange text-white text-center p-2 sm:p-4 rounded-lg z-30 shadow-md">
                <h2 className="text-xl sm:text-2xl font-bold">123+</h2>
                <p className="text-xs sm:text-sm">Keluhan Yang Teratasi</p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 p-4 sm:p-6 bg-peach-100 rounded-lg">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 font-second text-soft-orange">
              Tentang LaporinAja
            </h2>
            <p className="text-gray-600 mb-2 sm:mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <ul className="list-none text-gray-600 space-y-1 sm:space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-soft-orange rounded-full mr-2"></span>{" "}
                Curabitur gravida sem
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-soft-orange rounded-full mr-2"></span>{" "}
                Mauris tempor ac erat
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-soft-orange rounded-full mr-2"></span>{" "}
                Fuscus eleifend lectus
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-soft-orange rounded-full mr-2"></span>{" "}
                Fuscus non sodales
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-soft-orange rounded-full mr-2"></span>{" "}
                Class aptent taciti
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-soft-orange rounded-full mr-2"></span>{" "}
                Nam elementum semper
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* dampak section */}
      <section id="dampak" className="py-12 sm:py-16">
        <div className="container mx-auto max-w-[90%]">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold font-second text-soft-orange mb-4">
              Dampak Aplikasi Kami
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt.
            </p>
          </motion.div>

          {/* First Impact Point */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <h3 className="text-2xl font-semibold font-second text-soft-orange mb-3">
                Lebih dari 1.200 kerusakan diperbaiki
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <div className="w-full h-64 bg-gray-200 rounded-lg shadow-lg overflow-hidden">
                <img
                  src={After1}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>

          {/* Second Impact Point */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-full h-64 bg-gray-200 rounded-lg shadow-lg overflow-hidden">
                <img
                  src={After2}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-semibold font-second text-soft-orange mb-3">
                Lingkungan yang Lebih Bersih dan Aman
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
            </motion.div>
          </div>

          {/* Before and After Gallery with Interactive Slider */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h3 className="text-2xl font-semibold font-second text-soft-orange mb-3">
                Sebelum dan Sesudah
              </h3>
              <p className="text-gray-600 max-w-xl mx-auto">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg shadow-lg overflow-hidden"
              >
                <ReactCompareImage
                  leftImage={Before1}
                  rightImage={After1}
                  leftImageAlt="Sebelum"
                  rightImageAlt="Sesudah"
                  sliderLineColor="#EB5A3C"
                  sliderLineWidth={2}
                  handleSize={40}
                  leftImageLabel="Sebelum"
                  rightImageLabel="Sesudah"
                  className="w-full h-64"
                />
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg shadow-lg overflow-hidden"
              >
                <ReactCompareImage
                  leftImage={Before2}
                  rightImage={After2}
                  leftImageAlt="Sebelum"
                  rightImageAlt="Sesudah"
                  sliderLineColor="#EB5A3C"
                  sliderLineWidth={2}
                  handleSize={40}
                  leftImageLabel="Sebelum"
                  rightImageLabel="Sesudah"
                  className="w-full h-64"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
