"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const DEFAULT_COLORS: { [key: string]: string } = {
  HTML: "#E34F26", CSS: "#1572B6", JavaScript: "#F7DF1E",
  C: "#A8B9CC", "C++": "#00599C", Java: "#ED8B00",
  Python: "#3776AB", MySQL: "#4479A1", DBMS: "#2CB67D",
  Excel: "#217346", Word: "#2B579A", "UI/UX": "#FF6B6B",
};

const DEFAULT_ICONS: { [key: string]: string } = {
  HTML: "🌐", CSS: "🎨", JavaScript: "⚡", C: "💻", "C++": "🔧",
  Java: "☕", Python: "🐍", MySQL: "🗄️", DBMS: "#️⃣",
  Excel: "📊", Word: "📝", "UI/UX": "🎭",
};

export default function Notes() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snap = await getDocs(collection(db, "categories"));
        setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Categories fetch error:", err);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  return (
    <section className="min-h-screen bg-transparent text-white flex flex-col items-center px-6 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-4"
      >
        Notes <span className="text-[#7F5AF0]">Library</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-200 mb-12 text-center"
      >
        Apna course select karo aur notes padho 👇
      </motion.p>

      {loading ? (
        <p className="text-gray-200 text-lg animate-pulse">Loading courses...</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-400 text-lg">Abhi koi course available nahi hai.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 w-full max-w-4xl">
          {categories.map((cat, i) => {
            const color = DEFAULT_COLORS[cat.name] || "#7F5AF0";
            const icon = DEFAULT_ICONS[cat.name] || "📚";
            return (
              <motion.a
                key={cat.id}
                href={`/notes/category/${encodeURIComponent(cat.name)}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ scale: 1.06 }}
                className="flex flex-col items-center justify-center gap-3 rounded-2xl p-6 cursor-pointer transition-all duration-300"
                style={{
                  background: `${color}15`,
                  border: `2px solid ${color}40`,
                  boxShadow: `0 4px 24px ${color}20`,
                }}
              >
                <span className="text-4xl">{icon}</span>
                <span className="font-bold text-white text-lg text-center">{cat.name}</span>
                <span
                  className="text-xs px-3 py-1 rounded-full font-semibold"
                  style={{ backgroundColor: `${color}30`, color }}
                >
                  Notes →
                </span>
              </motion.a>
            );
          })}
        </div>
      )}
    </section>
  );
}
