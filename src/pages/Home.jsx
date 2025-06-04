import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiPlay, FiPause, FiPlus, FiMinus } from "react-icons/fi";
import Navbar from "../components/Fragments/Navbar";
import Button from "../components/Elements/Button";
import ReactCompareImage from "react-compare-image";
import AcceptTask from "../assets/accepttask.svg";
import Img1 from "../assets/img1.jpg";
import Img2 from "../assets/img2.jpg";
import Img3 from "../assets/img3.jpg";
import Img4 from "../assets/img4.jpg";
import Before1 from "../assets/Before1.png";
import After1 from "../assets/After1.png";
import Before2 from "../assets/Before2.png";
import After2 from "../assets/After2.png";
import Contoh from "../assets/contoh.mp4";

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [openStep, setOpenStep] = useState(1);
  const [expandedStep, setExpandedStep] = useState(1);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
      setShowIcon(false);
    } else {
      video.pause();
      setIsPlaying(false);
      setShowIcon(true);
    }
  };

  const handlePointerEnter = () => {
    if (isPlaying) setShowIcon(true);
  };

  const handlePointerLeave = () => {
    if (isPlaying) setShowIcon(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      number: 1,
      title: "Sign Up",
      details: [
        "Brief description of how to sign up.",
        "Image or video of the sign-up page.",
        "Tooltip explaining each field in the sign-up form.",
      ],
    },
    {
      number: 2,
      title: "Customize Your Profile",
      details: [],
    },
    {
      number: 3,
      title: "Start Using Our Service",
      details: [],
    },
    {
      number: 4,
      title: "Get Support",
      details: [],
    },
  ];

  const faqs = [
    {
      question: "Apa itu CodeLab?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      question: "Apakah CodeLab mudah dikustomisasi?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus.",
    },
    {
      question: "Teknologi apa yang digunakan oleh CodeLab?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
    },
    {
      question: "Apakah saya butuh skill coding tingkat lanjut?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam nec dui quis sapien sodales fringilla.",
    },
    {
      question: "Bagaimana cara mendapatkan support?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tincidunt, nisl eget vestibulum posuere.",
    },
  ];

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
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-700 leading-tight mb-4">
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4 font-second text-soft-orange">
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
            <h2 className="text-3xl sm:text-4xl font-bold font-second text-soft-orange mb-4">
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

      {/* cara pemakaian section */}
      <section id="carapemakaian" className="py-12 sm:py-16">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between max-w-[90%]">
          {/* Text Section */}
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0 lg:pr-8">
            <h2 className="text-3xl sm:text-4xl  font-bold font-second text-soft-orange mb-6">
              Cara Pemakaian
            </h2>
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.number}>
                  <button
                    onClick={() => {
                      setOpenStep(step.number); // Set active step
                      setExpandedStep(
                        expandedStep === step.number ? null : step.number
                      ); // Toggle details
                    }}
                    className="flex items-center justify-between w-full text-left focus:outline-none"
                  >
                    <span className="flex items-center">
                      <span
                        className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 border border-soft-orange ${
                          openStep === step.number
                            ? "bg-soft-orange text-white"
                            : "text-soft-orange"
                        }`}
                      >
                        {step.number}
                      </span>
                      <span className="text-lg font-medium text-gray-700">
                        {step.title}
                      </span>
                    </span>
                    <svg
                      className={`w-5 h-5 transform transition-transform ${
                        expandedStep === step.number ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {expandedStep === step.number && step.details.length > 0 && (
                    <ul className="mt-2 ml-11 space-y-1 text-gray-600 list-disc">
                      {step.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* video step */}
          <div
            className="w-full lg:w-1/2 relative"
            onMouseEnter={handlePointerEnter}
            onMouseLeave={handlePointerLeave}
            onTouchStart={handlePointerEnter}
          >
            <video
              ref={videoRef}
              src={Contoh}
              className="rounded-lg shadow-lg w-full h-auto object-cover"
              onClick={togglePlay}
            >
              Your browser does not support the video tag.
            </video>

            {showIcon && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  className="bg-soft-orange text-white rounded-full w-16 h-16 flex items-center justify-center hover:bg-soft-orange-400 shadow-md shadow-soft-orange-400 transition duration-300 cursor-pointer"
                  onClick={togglePlay}
                >
                  {isPlaying ? <FiPause /> : <FiPlay />}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* tanya jawab section */}
      <section
        id="tanyajawab"
        className="py-12 sm:py-16"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold font-second text-soft-orange mb-2">Tanya Jawab</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
            blandit tempus porttitor.
          </p>
        </div>

        {/* Flex Container */}
        <div className="container mx-auto max-w-[90%]">
          <div className="flex flex-col lg:flex-row gap-8 h-full">
            {/* Left: FAQ List */}
            <div className="w-full lg:w-2/3 space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center px-4 py-3 text-left text-lg font-medium focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    {activeIndex === index ? <FiMinus /> : <FiPlus />}
                  </button>
                  {activeIndex === index && (
                    <div className="px-4 pb-4 text-gray-600">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Right: Contact Card */}
            <div className="w-full lg:w-1/3 flex items-stretch">
              <div className="bg-soft-orange/10 p-6 sm:p-8 rounded-2xl text-center flex flex-col justify-center w-full">
                <h3 className="text-xl font-semibold mb-2 leading-tight">
                  Punya Pertanyaan Lain?
                </h3>
                <p className="mb-4 text-gray-600 leading-relaxed">
                  Kami siap membantu Anda. Jangan ragu untuk menghubungi tim
                  kami kapan saja.
                </p>
                <Button color="softorange">Hubungi Kami</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
