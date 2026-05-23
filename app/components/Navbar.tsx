"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 w-full z-50 bg-[#16161A]/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#home" className="text-xl font-bold text-white">
          Om <span className="text-[#7F5AF0]">Awasthi</span>
        </a>

        <div className="hidden md:flex gap-8">
          <a href="#home" className="text-gray-400 hover:text-[#7F5AF0] transition-colors duration-300 text-sm font-medium">Home</a>
          <a href="#about" className="text-gray-400 hover:text-[#7F5AF0] transition-colors duration-300 text-sm font-medium">About</a>
          <a href="#skills" className="text-gray-400 hover:text-[#7F5AF0] transition-colors duration-300 text-sm font-medium">Skills</a>
          <a href="#projects" className="text-gray-400 hover:text-[#7F5AF0] transition-colors duration-300 text-sm font-medium">Projects</a>
          <a href="#notes" className="text-gray-400 hover:text-[#7F5AF0] transition-colors duration-300 text-sm font-medium">Notes</a>
          <a href="#contact" className="text-gray-400 hover:text-[#7F5AF0] transition-colors duration-300 text-sm font-medium">Contact</a>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-white text-2xl">
          {open ? "X" : "="}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[#16161A] border-t border-white/10 px-6 py-4 flex flex-col gap-4"
        >
          <a href="#home" onClick={() => setOpen(false)} className="text-gray-400 hover:text-[#7F5AF0] text-sm font-medium">Home</a>
          <a href="#about" onClick={() => setOpen(false)} className="text-gray-400 hover:text-[#7F5AF0] text-sm font-medium">About</a>
          <a href="#skills" onClick={() => setOpen(false)} className="text-gray-400 hover:text-[#7F5AF0] text-sm font-medium">Skills</a>
          <a href="#projects" onClick={() => setOpen(false)} className="text-gray-400 hover:text-[#7F5AF0] text-sm font-medium">Projects</a>
          <a href="#notes" onClick={() => setOpen(false)} className="text-gray-400 hover:text-[#7F5AF0] text-sm font-medium">Notes</a>
          <a href="#contact" onClick={() => setOpen(false)} className="text-gray-400 hover:text-[#7F5AF0] text-sm font-medium">Contact</a>
        </motion.div>
      )}
    </motion.nav>
  );
}