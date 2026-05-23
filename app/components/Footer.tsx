"use client";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-[#16161A] text-white border-t border-white/10 px-6 py-10 flex flex-col items-center gap-6"
    >
      <p className="text-2xl font-bold">
        Om <span className="text-[#7F5AF0]">Awasthi</span>
      </p>

      <div className="flex gap-6 text-sm text-gray-400">
        <a href="#" className="hover:text-[#7F5AF0] transition-colors">Hero</a>
        <a href="#" className="hover:text-[#7F5AF0] transition-colors">About</a>
        <a href="#" className="hover:text-[#7F5AF0] transition-colors">Skills</a>
        <a href="#" className="hover:text-[#7F5AF0] transition-colors">Projects</a>
        <a href="#" className="hover:text-[#7F5AF0] transition-colors">Contact</a>
      </div>

      <div className="flex gap-4">
        <a href="mailto:omawasthi379@gmail.com" className="bg-[#242629] px-4 py-2 rounded-xl text-sm hover:bg-[#7F5AF0] transition-all duration-300">📧 Email</a>
        <a href="#" className="bg-[#242629] px-4 py-2 rounded-xl text-sm hover:bg-[#2CB67D] transition-all duration-300">💼 LinkedIn</a>
        <a href="#" className="bg-[#242629] px-4 py-2 rounded-xl text-sm hover:bg-[#333] transition-all duration-300">🐙 GitHub</a>
      </div>

      <p className="text-gray-600 text-sm">© 2026 Om Awasthi. All rights reserved.</p>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="bg-[#7F5AF0] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#6B46E0] transition-all duration-300 hover:scale-105"
      >
        ↑ Back to Top
      </button>
    </motion.footer>
  );
}