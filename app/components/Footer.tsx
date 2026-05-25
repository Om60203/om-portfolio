"use client";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="text-white border-t border-white/10 px-6 py-10 flex flex-col items-center gap-6 relative z-10"
      style={{ background: "rgba(26,5,51,0.7)", backdropFilter: "blur(20px)" }}
    >
      <p className="text-2xl font-bold">
        Om <span className="text-[#7F5AF0]">Awasthi</span>
      </p>

      <div className="flex gap-6 text-sm text-gray-200">
        <a href="#home" className="hover:text-[#7F5AF0] transition-colors">Home</a>
        <a href="#about" className="hover:text-[#7F5AF0] transition-colors">About</a>
        <a href="#skills" className="hover:text-[#7F5AF0] transition-colors">Skills</a>
        <a href="#projects" className="hover:text-[#7F5AF0] transition-colors">Projects</a>
        <a href="#notes" className="hover:text-[#7F5AF0] transition-colors">Notes</a>
        <a href="#contact" className="hover:text-[#7F5AF0] transition-colors">Contact</a>
      </div>

      <div className="flex gap-4">
        <a href="mailto:omawasthi379@gmail.com" className="px-4 py-2 rounded-xl text-sm hover:bg-[#7F5AF0] transition-all duration-300"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
          📧 Email
        </a>
        <a href="#" className="px-4 py-2 rounded-xl text-sm hover:bg-[#2CB67D] transition-all duration-300"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
          💼 LinkedIn
        </a>
        <a href="https://github.com/Om60203" className="px-4 py-2 rounded-xl text-sm hover:bg-white/20 transition-all duration-300"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
          🐙 GitHub
        </a>
      </div>

      <p className="text-gray-300 text-sm">© 2026 Om Awasthi. All rights reserved.</p>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 text-white"
        style={{ background: "linear-gradient(135deg, #7F5AF0, #2CB67D)", boxShadow: "0 4px 15px rgba(127,90,240,0.4)" }}
      >
        ↑ Back to Top
      </button>
    </motion.footer>
  );
}