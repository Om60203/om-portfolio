"use client";
import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

const DEFAULT_COLORS: { [key: string]: string } = {
  HTML: "#E34F26", CSS: "#1572B6", JavaScript: "#F7DF1E",
  C: "#A8B9CC", "C++": "#00599C", Java: "#ED8B00",
  Python: "#3776AB", MySQL: "#4479A1", DBMS: "#2CB67D",
  Excel: "#217346", Word: "#2B579A", "UI/UX": "#FF6B6B",
};

export default function CategoryPage() {
  const { cat } = useParams();
  const categoryName = decodeURIComponent(cat as string);
  const color = DEFAULT_COLORS[categoryName] || "#7F5AF0";

  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const q = query(collection(db, "notes"), where("category", "==", categoryName));
        const snap = await getDocs(q);
        setNotes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Notes fetch error:", err);
      }
      setLoading(false);
    };
    fetchNotes();
  }, [categoryName]);

  const filtered = notes.filter((n) =>
    (n.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-transparent text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">

        {/* Back button */}
        <motion.a
          href="/#notes"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8"
        >
          ← Back to Courses
        </motion.a>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span
            className="text-xs px-3 py-1 rounded-full font-semibold mb-3 inline-block"
            style={{ backgroundColor: `${color}30`, color }}
          >
            Course
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            {categoryName} <span style={{ color }}>Notes</span>
          </h1>
          <p className="text-gray-400 mt-2">{notes.length} notes available</p>
        </motion.div>

        {/* Search */}
        <input
          type="text"
          placeholder={`Search ${categoryName} notes...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xl rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 mb-8"
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            border: `1px solid ${color}40`,
          }}
        />

        {/* Notes grid */}
        {loading ? (
          <p className="text-gray-300 text-lg animate-pulse">Loading notes...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400 text-lg mt-8">
            {search ? "Koi note nahi mila." : `${categoryName} ke notes abhi upload nahi hue.`}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((note, i) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ scale: 1.03 }}
                className="rounded-2xl p-6 flex flex-col justify-between transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${color}30`,
                  borderTop: `3px solid ${color}`,
                }}
              >
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{note.title}</h3>
                  {Array.isArray(note.content) && (
                    <p className="text-gray-500 text-xs">{note.content.length} sections</p>
                  )}
                </div>

                <div className="flex gap-2 mt-5">
                  <a
                    href={`/notes/${note.id}`}
                    className="flex-1 py-2 rounded-xl text-sm font-semibold text-white text-center transition-all hover:opacity-90"
                    style={{ backgroundColor: color }}
                  >
                    View
                  </a>
                  <button
                    className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                    onClick={() => {
                      if (note.pdfUrl) {
                        window.open(note.pdfUrl, "_blank");
                      } else {
                        alert("PDF available nahi hai is note ke liye!");
                      }
                    }}
                  >
                    {note.pdfUrl ? "⬇️ PDF" : "📄 Soon"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
