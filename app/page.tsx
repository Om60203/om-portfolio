"use client";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import About from "./components/About";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const roles = ["BCA Student", "Web Developer", "Notes Creator", "Tech Enthusiast"];

export default function Home() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <main className="min-h-screen bg-[#16161A] text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#7F5AF0] opacity-10 rounded-full blur-3xl pointer-events-none" />

        {/* Profile circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-32 h-32 rounded-full border-4 border-[#7F5AF0] overflow-hidden mb-6 z-10"
        >
          <img
            src="https://drive.google.com/uc?export=view&id=18LRh9hepti2MKUombdPMNDo93tWHD433"
            alt="Om Awasthi"
            className="w-full h-full object-cover"
          />
        </motion.div>
        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold text-center z-10"
        >
          Hi, I'm <span className="text-[#7F5AF0]">Om Awasthi</span>
        </motion.h1>

        {/* Typing role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-4 text-xl md:text-2xl text-[#2CB67D] font-medium z-10 h-8"
        >
          <motion.span
            key={roleIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {roles[roleIndex]}
          </motion.span>
        </motion.div>

        {/* College */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-2 text-gray-400 text-sm z-10"
        >
          Allenhouse Business School — BCA
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex flex-wrap gap-4 justify-center z-10"
        >
          <button className="px-6 py-3 bg-[#7F5AF0] hover:bg-[#6B46E0] rounded-xl font-semibold transition-all duration-300 hover:scale-105">
            View Projects
          </button>
          <button className="px-6 py-3 bg-[#2CB67D] hover:bg-[#24A06D] rounded-xl font-semibold transition-all duration-300 hover:scale-105">
            View Notes
          </button>
          <button className="px-6 py-3 border border-[#7F5AF0] text-[#7F5AF0] hover:bg-[#7F5AF0] hover:text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105">
            Contact Me
          </button>
        </motion.div>

      </main>

      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}
