"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="min-h-screen bg-[#0f0f13] text-white flex flex-col items-center justify-center px-6 py-20">

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-4"
      >
        Contact <span className="text-[#7F5AF0]">Me</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-400 mb-12 text-center"
      >
        Feel free to reach out anytime!
      </motion.p>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Left — Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6"
        >
          <div className="bg-[#242629] border border-white/10 rounded-2xl p-6">
            <p className="text-[#7F5AF0] font-semibold mb-1">📧 Email</p>
            <p className="text-gray-300 text-sm">omawasthi379@gmail.com</p>
          </div>
          <div className="bg-[#242629] border border-white/10 rounded-2xl p-6">
            <p className="text-[#2CB67D] font-semibold mb-1">💼 LinkedIn</p>
            <p className="text-gray-300 text-sm">Om Awasthi</p>
          </div>
          <div className="bg-[#242629] border border-white/10 rounded-2xl p-6">
            <p className="text-[#F5A623] font-semibold mb-1">📸 Instagram</p>
            <p className="text-gray-300 text-sm">@om_awasthi11</p>
          </div>
          <div className="bg-[#242629] border border-white/10 rounded-2xl p-6">
            <p className="text-gray-400 font-semibold mb-1">🐙 GitHub</p>
            <p className="text-gray-300 text-sm">github.com/Om60203</p>
          </div>
        </motion.div>

        {/* Right — Form */}
        <motion.form
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="bg-[#242629] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F5AF0] transition-all duration-300"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="bg-[#242629] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F5AF0] transition-all duration-300"
          />
          <textarea
            placeholder="Your Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            rows={5}
            className="bg-[#242629] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F5AF0] transition-all duration-300 resize-none"
          />
          <button
            type="submit"
            className="py-3 rounded-xl bg-[#7F5AF0] hover:bg-[#6B46E0] font-semibold transition-all duration-300 hover:scale-105"
          >
            {sent ? "✅ Message Sent!" : "Send Message 🚀"}
          </button>
        </motion.form>

      </div>
    </section>
  );
}