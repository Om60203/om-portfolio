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
        className="text-gray-200 mb-8 text-center"
      >
        Study notes for BCA students
      </motion.p>

      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-xl rounded-xl px-4 py-3 text-white placeholder-gray-300 focus:outline-none transition-all duration-300 mb-6"
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      />

      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300"
            style={
              selected === cat
                ? { background: "#7F5AF0", color: "white" }
                : {
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.7)",
                  }
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-200 text-lg animate-pulse">Loading notes...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {filtered.map((note, i) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ scale: 1.03 }}
              className="rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between"
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              {/* Category badge */}
              <div>
                <span
                  className="text-xs px-3 py-1 rounded-full font-semibold mb-3 inline-block"
                  style={{
                    backgroundColor: `${colors[note.category] || "#7F5AF0"}30`,
                    color: colors[note.category] || "#7F5AF0",
                  }}
                >
                  {note.category}
                </span>

                {/* Only title shown — no description */}
                <h3 className="text-lg font-bold text-white mt-2">{note.title}</h3>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-6">
                <a
                  href={`/notes/${note.id}`}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold text-white text-center transition-all hover:opacity-90"
                  style={{ backgroundColor: colors[note.category] || "#7F5AF0" }}
                >
                  View
                </a>
                <button
                  className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                  onClick={() => {
                    if (note.pdfUrl) {
                      window.open(note.pdfUrl, "_blank");
                    } else {
                      alert("PDF available nahi hai is note ke liye!");
                    }
                  }}
                >
                  Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <p className="text-gray-300 mt-12 text-lg">No notes found</p>
      )}
    </section>
  );
}
