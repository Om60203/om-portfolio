"use client";
import Navbar from "./components/Navbar";
import Notes from "./components/Notes";
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
      <Navbar />

      <main id="home" className="min-h-screen bg-transparent text-white flex flex-col items-center justify-center px-6 relative overflow-hidden pt-20">

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-32 h-32 rounded-full border-4 border-[#7F5AF0] overflow-hidden mb-6 z-10 floating glow-border pulse-ring"
        >
          <img src="/profile.jpg" alt="Om Awasthi" className="w-full h-full object-cover" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold text-center z-10 neon-text"
        >
          Hi, I'm <span className="text-[#7F5AF0]">Om Awasthi</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-4 text-xl md:text-2xl text-[#2CB67D] font-medium z-10 h-8 neon-green"
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

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-2 text-gray-200 text-sm z-10"
        >
          Allenhouse Business School — BCA
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex flex-wrap gap-4 justify-center z-10"
        >
          <button className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-white"
            style={{ background: "linear-gradient(135deg, #7F5AF0, #6B46E0)", boxShadow: "0 4px 20px rgba(127,90,240,0.4)" }}>
            View Projects
          </button>
          <button className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-white"
            style={{ background: "linear-gradient(135deg, #2CB67D, #24A06D)", boxShadow: "0 4px 20px rgba(44,182,125,0.4)" }}>
            View Notes
          </button>
          <button className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-white"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(127,90,240,0.6)", backdropFilter: "blur(10px)" }}>
            Contact Me
          </button>
        </motion.div>

      </main>

      <div id="about"><About /></div>
      <div id="skills"><Skills /></div>
      <div id="projects"><Projects /></div>
      <div id="notes"><Notes /></div>
      <div id="contact"><Contact /></div>
      <Footer />
    </>
  );
}