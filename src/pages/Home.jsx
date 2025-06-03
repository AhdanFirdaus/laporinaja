import Navbar from "../components/Fragments/Navbar";
import Button from "../components/Elements/Button";
import { motion } from "framer-motion";
import AcceptTask from "../assets/undraw_accept-task_vzpn.svg";

export default function Home() {
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
      <section id="tentang"></section>
    </>
  );
}
