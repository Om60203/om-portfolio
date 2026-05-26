"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function About() {
  const [cards, setCards] = useState<any[]>([]);
  const [journey, setJourney] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cardsSnap = await getDocs(collection(db, "about_cards"));
        setCards(cardsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        const journeySnap = await getDocs(query(collection(db, "journey"), orderBy("year")));
        setJourney(journeySnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const journeyColors = ["#7F5AF0", "#2CB67D", "#F5A623", "#E44D7B"];

  return (
    <section className="min-h-screen bg-transparent text-white flex flex-col items-center justify-center px-6 py-20">

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-4"
      >
        About <span className="text-[#7F5AF0]">Me</span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="max-w-2xl text-center text-gray-200 text-lg leading-relaxed mb-12"
      >
        I'm <span className="text-white font-semibold">Om Awasthi</span>, a BCA student at
        <span className="text-[#7F5AF0]"> Allenhouse Business School</span>. I'm passionate
        about web development, creating useful tools, and sharing knowledge through notes.
      </motion.div>

      {/* Info Cards — Firebase se */}
      {cards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-16">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(127,90,240,0.3)",
              }}
            >
              <div className="text-4xl mb-3">{card.icon}</div>
              <p className="text-[#7F5AF0] font-semibold mb-1">{card.title}</p>
              <p className="text-gray-200 text-sm">{card.shortDesc}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Default cards agar Firebase mein kuch nahi */}
      {cards.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-16">
          {[
            { icon: "🎓", title: "Education", value: "BCA — Allenhouse Business School" },
            { icon: "📍", title: "Location", value: "Uttar Pradesh, India" },
            { icon: "💡", title: "Interests", value: "Web Dev, Notes, Tech" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(127,90,240,0.3)",
              }}
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <p className="text-[#7F5AF0] font-semibold mb-1">{item.title}</p>
              <p className="text-gray-200 text-sm">{item.value}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Timeline */}
      <motion.h3
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-2xl font-bold mb-8 text-[#2CB67D]"
      >
        My Journey
      </motion.h3>

      <div className="flex flex-col gap-6 w-full max-w-xl">
        {/* Firebase journey */}
        {journey.length > 0 ? journey.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="flex gap-4 items-start rounded-xl p-4 transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="font-bold text-sm min-w-[40px] mt-1" style={{ color: journeyColors[i % journeyColors.length] }}>{item.year}</div>
            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: journeyColors[i % journeyColors.length] }} />
            <div className="text-gray-200 text-sm leading-relaxed">{item.title}</div>
          </motion.div>
        )) : (
          // Default journey
          [
            { year: "2024", text: "Started BCA at Allenhouse Business School — Learned HTML, CSS & C language", color: "#7F5AF0" },
            { year: "2025", text: "Leveled up with C++, MySQL & Java", color: "#2CB67D" },
            { year: "2026", text: "Exploring Python & DBMS — Building full-stack portfolio & notes platform", color: "#F5A623" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="flex gap-4 items-start rounded-xl p-4 transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="font-bold text-sm min-w-[40px] mt-1" style={{ color: item.color }}>{item.year}</div>
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: item.color }} />
              <div className="text-gray-200 text-sm leading-relaxed">{item.text}</div>
            </motion.div>
          ))
        )}
      </div>

    </section>
  );
}