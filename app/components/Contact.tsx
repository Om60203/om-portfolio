"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await emailjs.send(
        "service_kijuncc",
        "template_yrddpos",
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        "lsMHJIwyB09wVSAXx"
      );
      setSent(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 4000);
    } catch (error) {
      alert("Message could not be sent, please try again!");
    } finally {
      setLoading(false);
    }
  };

  const glassStyle = {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.12)",
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.15)",
  };

  return (
    <section className="min-h-screen bg-transparent text-white flex flex-col items-center justify-center px-6 py-20">

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
        className="text-gray-200 mb-12 text-center"
      >
        Feel free to reach out anytime!
      </motion.p>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12">

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6"
        >
          {[
            { color: "#7F5AF0", icon: "📧", label: "Email", value: "omawasthi379@gmail.com" },
            { color: "#2CB67D", icon: "💼", label: "LinkedIn", value: "Om Awasthi" },
            { color: "#F5A623", icon: "📸", label: "Instagram", value: "@om_awasthi11" },
            { color: "#ffffff", icon: "🐙", label: "GitHub", value: "github.com/Om60203" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-6"
              style={glassStyle}
            >
              <p className="font-semibold mb-1" style={{ color: item.color }}>{item.icon} {item.label}</p>
              <p className="text-gray-200 text-sm">{item.value}</p>
            </motion.div>
          ))}
        </motion.div>

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
            className="rounded-xl px-4 py-3 text-white placeholder-gray-300 focus:outline-none transition-all duration-300"
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="rounded-xl px-4 py-3 text-white placeholder-gray-300 focus:outline-none transition-all duration-300"
            style={inputStyle}
          />
          <textarea
            placeholder="Your Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            rows={5}
            className="rounded-xl px-4 py-3 text-white placeholder-gray-300 focus:outline-none transition-all duration-300 resize-none"
            style={inputStyle}
          />
          <button
            type="submit"
            disabled={loading}
            className="py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 text-white"
            style={{
              background: "linear-gradient(135deg, #7F5AF0, #2CB67D)",
              boxShadow: "0 4px 20px rgba(127,90,240,0.4)"
            }}
          >
            {loading ? "Sending..." : sent ? "✅ Message Sent!" : "Send Message 🚀"}
          </button>
        </motion.form>

      </div>
    </section>
  );
}