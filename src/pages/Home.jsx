import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiPlay, FiPause, FiPlus, FiMinus, FiChevronDown, FiChevronUp } from "react-icons/fi";
import Navbar from "../components/Fragments/Navbar";
import Button from "../components/Elements/Button";
import ReactCompareImage from "react-compare-image";
import * as Imgs from "../assets/images/Images";
import Contoh from "../assets/videos/contoh.mp4";
import Footer from "../components/Fragments/Footer";
import Chatbot from "../components/Fragments/ChatBot";

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
      question: "Apa itu LaporinAja?",
      answer:
        "LaporinAja adalah layanan digital yang memudahkan warga Semarang untuk melaporkan kerusakan atau kendala di fasilitas umum secara cepat dan aman.",
    },
    {
      question: "Siapa saja yang bisa menggunakan LaporinAja?",
      answer:
        "Warga Semarang yang telah terverifikasi dengan KTP dapat menggunakan aplikasi ini untuk melaporkan masalah di lingkungan sekitar.",
    },
    {
      question: "Apakah data pribadi saya aman?",
      answer:
        "Ya, semua data pengguna akan dienkripsi dan hanya digunakan untuk verifikasi. Identitas pelapor tidak akan ditampilkan secara publik.",
    },
    {
      question: "Jenis masalah apa saja yang bisa dilaporkan?",
      answer:
        "Kamu bisa melaporkan berbagai masalah seperti jalan rusak, lampu jalan mati, saluran air tersumbat, sampah menumpuk, hingga isu keamanan.",
    },
    {
      question: "Bagaimana laporan saya diproses?",
      answer:
        "Setelah laporan dikirim, pihak terkait akan meninjau dan memverifikasi laporan tersebut. Petugas juga akan melakukan pengecekan langsung di lapangan.",
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
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-700 leading-tight mb-4"><span className="text-4xl md:text-5xl font-bold text-gray-900">📢 LaporinAja</span>
            </h1>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-700 leading-tight mb-4"><span className="text-4xl md:text-5xl font-bold text-gray-900">Suara Warga, Aksi Nyata! 💪</span>
            </h1>
            <p className="text-lg text-gray-600">
              Bersama kita wujudkan fasilitas umum yang layak, aman, dan nyaman.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Laporkan kendala di sekitarmu dan jadilah bagian dari perubahan nyata. ✨
            </p>
            <Button className="text-lg">Lebih Lanjut</Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="lg:w-1/2 flex justify-end"
          >
            <div className="relative">
              <div className="w-64 h-54 sm:w-96 sm:h-80 lg:w-[450px] lg:h-[420px] flex items-center justify-center">
                <img
                  src={Imgs.AcceptTask}
                  alt="website"
                  className="w-full h-auto"
                />
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
      <section id="tentang" className="py-12 sm:py-16 bg-soft-orange/10">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between max-w-[90%]">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <div className="relative w-full">
              <div className="relative w-full h-64 sm:h-80 md:h-96">
                {/* Main image (left) */}
                {[Imgs.Img4, Imgs.Img3, Imgs.Img2, Imgs.Img1].map(
                  (src, index) => (
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
                  )
                )}
                {/* Bottom-right image */}
                {[Imgs.Img1, Imgs.Img2, Imgs.Img3, Imgs.Img4].map(
                  (src, index) => (
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
                  )
                )}
              </div>
              <div className="absolute bottom-[-5%] left-[5%] sm:bottom-[-10%] sm:left-[10%] w-1/3 sm:w-1/4 md:w-1/3 bg-soft-orange text-white text-center p-2 sm:p-4 rounded-lg z-30 shadow-md">
                <h2 className="text-xl sm:text-2xl font-bold">1.250+</h2>
                <p className="text-xs sm:text-sm">Keluhan Yang Teratasi</p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 p-4 sm:p-6 bg-peach-100 rounded-lg">
            <h2 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4 font-second text-soft-orange">
              Tentang LaporinAja
            </h2>
            <p className="text-gray-600 mb-2 sm:mb-4">
              LaporinAja adalah layanan pengaduan digital yang memudahkan warga Semarang melaporkan kerusakan atau kendala fasilitas umum. Setiap laporan ditindaklanjuti secara aman dan transparan demi lingkungan kota yang lebih tertib dan nyaman.
            </p>
            <ul className="list-none text-gray-600 space-y-1 sm:space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-soft-orange rounded-full mr-2"></span>
                Mudah digunakan oleh semua warga
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-soft-orange rounded-full mr-2"></span>
                Mendorong kepedulian lingkungan sekitar
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-soft-orange rounded-full mr-2"></span>
                Menjaga privasi pelapor
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-soft-orange rounded-full mr-2"></span>
                Kolaborasi antara warga dan pemerintah
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-soft-orange rounded-full mr-2"></span>
                Membangun kota yang lebih baik bersama
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
              LaporinAja mendorong partisipasi warga, mempercepat penanganan masalah, dan membangun lingkungan kota yang lebih tertib dan nyaman.
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
              <h3 className="text-3xl font-semibold font-second text-soft-orange mb-3">
                Ribuan Warga Terbantu Lewat Aksi Nyata
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Partisipasi aktif warga dalam melaporkan masalah membuat banyak kendala cepat ditangani. Kolaborasi ini terbukti meningkatkan kualitas hidup masyarakat di berbagai kecamatan.
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
                  src={Imgs.Dampak1}
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
                  src={Imgs.Dampak2}
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
              <h3 className="text-3xl font-semibold font-second text-soft-orange mb-3">
                Kolaborasi Warga dan Pemerintah
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Dengan saling mendukung dan bertindak bersama, kolaborasi antara masyarakat dan pemerintah mampu menghadirkan solusi nyata demi kota yang lebih tertib, bersih, dan nyaman.
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
              <h3 className="text-3xl font-semibold font-second text-soft-orange mb-3">
                Sebelum dan Sesudah
              </h3>
              <p className="text-gray-600 max-w-xl mx-auto">
                Buktikan sendiri perubahan nyata fasilitas umum yang makin baik berkat laporan dan aksi kita bersama!
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg shadow-lg overflow-hidden"
              >
                <ReactCompareImage
                  leftImage={Imgs.Before1}
                  rightImage={Imgs.After1}
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
                  leftImage={Imgs.Before2}
                  rightImage={Imgs.After2}
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
                    className="flex items-center justify-between w-full text-left focus:outline-none cursor-pointer"
                  >
                    <span className="flex items-center">
                      <span
                        className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 border border-soft-orange ${openStep === step.number
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
                    {expandedStep === step.number ? (
                      <FiChevronUp />
                    ) : (
                      <FiChevronDown />
                    )}
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
      <section id="tanyajawab" className="py-12 sm:py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold font-second text-soft-orange mb-2">
            Tanya Jawab
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan jawaban dari pertanyaan umum seputar penggunaan LaporinAja dan cara berkontribusi untuk lingkungan sekitar.
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
                    className="w-full flex justify-between items-center px-4 py-3 text-left font-medium focus:outline-none cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {activeIndex === index ? <FiMinus /> : <FiPlus />}
                  </button>
                  {activeIndex === index && (
                    <div className="px-4 pb-4 text-gray-700">{faq.answer}</div>
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
                <Button
                  color="softorange"
                  href="https://wa.me/62895339023888?text=Halo%20Tim%20LaporinAja%F0%9F%91%8B%2C%0A%0ASaya%20memiliki%20pertanyaan%20terkait%3A%0A%0Apesan%0A%0ATerima%20kasih%20%F0%9F%99%8F."
                  target="_blank"
                >
                  Hubungi Kami
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* chatbot */}
      <Chatbot/>

      {/* footer */}
      <Footer />
    </>
  );
}
