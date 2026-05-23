"use client";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

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

export default function NotePage() {
  const { id } = useParams();
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const docRef = doc(db, "notes", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNote({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error:", error);
      }
      setLoading(false);
    };
    fetchNote();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#16161A] text-white flex items-center justify-center">
        <p className="text-gray-400 text-xl animate-pulse">Loading note...</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-[#16161A] text-white flex items-center justify-center">
        <p className="text-red-400 text-xl">Note not found!</p>
      </div>
    );
  }

  const color = colors[note.category] || "#7F5AF0";

  return (
    <div className="min-h-screen bg-[#16161A] text-white px-6 py-12">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl" style={{ backgroundColor: color }} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">

        <motion.a href="/#notes" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
          Back to Notes
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#242629] border border-white/10 rounded-2xl p-8 mb-6"
          style={{ borderTop: `4px solid ${color}` }}
        >
          <span className="text-xs px-3 py-1 rounded-full font-semibold mb-4 inline-block" style={{ backgroundColor: `${color}20`, color: color }}>
            {note.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{note.title}</h1>
          <p className="text-gray-400 leading-relaxed text-lg">{note.description}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex gap-4">
          <button className="flex-1 py-4 rounded-2xl font-semibold text-white text-lg transition-all duration-300 hover:scale-105" style={{ backgroundColor: color }} onClick={() => alert("PDF download coming soon!")}>
            Download Notes
          </button>
          <a href="/#notes" className="px-8 py-4 rounded-2xl font-semibold border border-white/20 hover:border-[#7F5AF0] transition-all duration-300 hover:scale-105">
            Back
          </a>
        </motion.div>

      </div>
    </div>
  );
}