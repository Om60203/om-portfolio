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

// Render each content block
function ContentBlock({ block, color }: { block: any; color: string }) {
  if (block.type === "text") {
    return (
      <p className="text-gray-200 leading-relaxed text-base whitespace-pre-wrap mb-4">
        {block.value}
      </p>
    );
  }

  if (block.type === "code") {
    return (
      <div className="mb-4 rounded-xl overflow-hidden border border-white/10">
        <div
          className="px-4 py-2 text-xs font-semibold text-white flex items-center gap-2"
          style={{ backgroundColor: `${color}40` }}
        >
          <span>💻</span> Code
        </div>
        <pre
          className="p-4 text-sm text-green-300 overflow-x-auto"
          style={{ background: "rgba(0,0,0,0.4)", fontFamily: "monospace" }}
        >
          <code>{block.value}</code>
        </pre>
      </div>
    );
  }

  if (block.type === "image") {
    return (
      <div className="mb-4 rounded-xl overflow-hidden border border-white/10">
        <img
          src={block.value}
          alt="Note image"
          className="w-full object-contain max-h-[500px]"
          style={{ background: "rgba(0,0,0,0.2)" }}
        />
      </div>
    );
  }

  return null;
}

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
      <div className="min-h-screen bg-transparent text-white flex items-center justify-center">
        <p className="text-gray-200 text-xl animate-pulse">Loading note...</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-transparent text-white flex items-center justify-center">
        <p className="text-red-300 text-xl">Note not found!</p>
      </div>
    );
  }

  const color = colors[note.category] || "#7F5AF0";

  // Support both old (description string) and new (content array) format
  const blocks: any[] =
    Array.isArray(note.content) && note.content.length > 0
      ? note.content
      : note.description
      ? [{ type: "text", value: note.description }]
      : [];

  return (
    <div className="min-h-screen bg-transparent text-white px-6 py-12">
      <div className="max-w-4xl mx-auto relative z-10">

        {/* Back button */}
        <motion.a
          href="/#notes"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 text-gray-200 hover:text-white transition-colors mb-8"
        >
          ← Back to Notes
        </motion.a>

        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl p-8 mb-6"
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            border: `1px solid rgba(255,255,255,0.15)`,
            borderTop: `4px solid ${color}`,
          }}
        >
          <span
            className="text-xs px-3 py-1 rounded-full font-semibold mb-4 inline-block"
            style={{ backgroundColor: `${color}30`, color }}
          >
            {note.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white">{note.title}</h1>

          {/* Render content blocks */}
          <div>
            {blocks.length > 0 ? (
              blocks.map((block: any, i: number) => (
                <ContentBlock key={i} block={block} color={color} />
              ))
            ) : (
              <p className="text-gray-400">Koi content nahi hai is note mein.</p>
            )}
          </div>

          {note.pdfUrl && (
            <div
              className="mt-6 p-4 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <p className="text-green-400 text-sm font-semibold mb-1">📄 PDF Available</p>
              <p className="text-gray-300 text-xs">Download karke offline padho!</p>
            </div>
          )}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4"
        >
          <button
            className="flex-1 py-4 rounded-2xl font-semibold text-white text-lg transition-all duration-300 hover:scale-105 hover:opacity-90"
            style={{ backgroundColor: color, boxShadow: `0 4px 20px ${color}50` }}
            onClick={() => {
              if (note.pdfUrl) {
                window.open(note.pdfUrl, "_blank");
              } else {
                alert("PDF available nahi hai is note ke liye!");
              }
            }}
          >
            {note.pdfUrl ? "⬇️ Download PDF" : "📄 PDF Coming Soon"}
          </button>
          <a
            href="/#notes"
            className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            ← Back
          </a>
        </motion.div>

      </div>
    </div>
  );
}
