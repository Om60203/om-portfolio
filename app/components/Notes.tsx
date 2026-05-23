"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const categories = ["All", "HTML", "CSS", "JavaScript", "C", "C++", "Java", "Python", "MySQL", "DBMS"];

const colors: { [key: string]: string } = {
  HTML: "#E34F26",
  CSS: "#1572B6",
  JavaScript: "#F7DF1E",
  C: "#A8B9CC",
  "C++": "#00599C",
  Java: "#ED8B00",
  Python: "#3776AB",
  MySQL: "#4479A1",
  DBMS: "#2CB67D",
};

export default function Notes() {
  const [notes, setNotes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const snapshot = await getDocs(collection(db, "notes"));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setNotes(data);
      } catch (error) {
        console.error("Notes fetch error:", error);
      }
      setLoading(false);
    };
    fetchNotes();
  }, []);

  const filtered = notes.filter((note) => {
    const matchCategory = selected === "All" || (note.category || "") === selected;
    const matchSearch = (note.title || "").toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <section className="min-h-screen bg-[#16161A] text-white flex flex-col items-center px-6 py-20">
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
        className="text-gray-400 mb-8 text-center"
      >
        Study notes for BCA students
      </motion.p>

      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-xl bg-[#242629] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F5AF0] transition-all duration-300 mb-6"
      />

      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${selected === cat ? "bg-[#7F5AF0] text-white" : "bg-[#242629] text-gray-400"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400 text-lg">Loading notes...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {filtered.map((note, i) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ scale: 1.03 }}
              className="bg-[#242629] border border-white/10 rounded-2xl p-6 hover:border-[#7F5AF0]/50 transition-all duration-300"
            >
              <span
                className="text-xs px-3 py-1 rounded-full font-semibold mb-3 inline-block"
                style={{ backgroundColor: `${colors[note.category] || "#7F5AF0"}20`, color: colors[note.category] || "#7F5AF0" }}
              >
                {note.category}
              </span>
              <h3 className="text-lg font-bold mb-2">{note.title}</h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">{note.description}</p>
              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: colors[note.category] || "#7F5AF0" }}>
                  View
                </button>
                <button className="flex-1 py-2 rounded-xl text-sm font-semibold bg-[#16161A] border border-white/10 hover:border-[#7F5AF0] transition-all">
                  Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <p className="text-gray-500 mt-12 text-lg">No notes found</p>
      )}
    </section>
  );
}