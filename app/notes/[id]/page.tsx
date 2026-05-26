"use client";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

const colors: { [key: string]: string } = {
  HTML: "#E34F26", CSS: "#1572B6", JavaScript: "#F7DF1E",
  C: "#A8B9CC", "C++": "#00599C", Java: "#ED8B00",
  Python: "#3776AB", MySQL: "#4479A1", DBMS: "#2CB67D",
  Excel: "#217346", Word: "#2B579A", "UI/UX": "#FF6B6B",
};

function ContentBlock({ block, color }: { block: any; color: string }) {
  if (block.type === "text") return (
    <p className="text-gray-200 leading-relaxed text-base whitespace-pre-wrap mb-4">{block.value}</p>
  );
  if (block.type === "code") return (
    <div className="mb-4 rounded-xl overflow-hidden border border-white/10">
      <div className="px-4 py-2 text-xs font-semibold text-white flex items-center gap-2" style={{ backgroundColor: `${color}40` }}>
        <span>💻</span> Code
      </div>
      <pre className="p-4 text-sm text-green-300 overflow-x-auto" style={{ background: "rgba(0,0,0,0.4)", fontFamily: "monospace" }}>
        <code>{block.value}</code>
      </pre>
    </div>
  );
  if (block.type === "image") return (
    <div className="mb-4 rounded-xl overflow-hidden border border-white/10">
      <img src={block.value} alt="Note image" className="w-full object-contain max-h-[500px]" style={{ background: "rgba(0,0,0,0.2)" }} />
    </div>
  );
  return null;
}

function ShareButtons({ title, noteId }: { title: string; noteId: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/notes/${noteId}` : "";
  const text = `${title} — Om Awasthi Notes`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6 pt-6 border-t border-white/10">
      <p className="text-gray-400 text-xs mb-3">🔗 Share karo:</p>
      <div className="flex gap-2 flex-wrap">
        <a href={`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
          style={{ background: "rgba(37,211,102,0.15)", border: "1px solid rgba(37,211,102,0.4)", color: "#25D366" }}>
          💬 WhatsApp
        </a>
        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
          style={{ background: "rgba(29,161,242,0.15)", border: "1px solid rgba(29,161,242,0.4)", color: "#1DA1F2" }}>
          🐦 Twitter
        </a>
        <button onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
          style={{ background: "rgba(127,90,240,0.15)", border: "1px solid rgba(127,90,240,0.4)", color: "#7F5AF0" }}>
          {copied ? "✅ Copied!" : "🔗 Copy Link"}
        </button>
      </div>
    </div>
  );
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
        if (docSnap.exists()) setNote({ id: docSnap.id, ...docSnap.data() });
      } catch (error) { console.error("Error:", error); }
      setLoading(false);
    };
    fetchNote();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-transparent text-white flex items-center justify-center">
      <p className="text-gray-200 text-xl animate-pulse">Loading note...</p>
    </div>
  );

  if (!note) return (
    <div className="min-h-screen bg-transparent text-white flex items-center justify-center">
      <p className="text-red-300 text-xl">Note not found!</p>
    </div>
  );

  const color = colors[note.category] || "#7F5AF0";
  const blocks: any[] = Array.isArray(note.content) && note.content.length > 0
    ? note.content
    : note.description ? [{ type: "text", value: note.description }] : [];

  // ── PDF Download — Cloudinary raw URL fix ──
  const handleDownload = async () => {
    if (note.pdfUrl) {
      try {
        await updateDoc(doc(db, "notes", id as string), { downloads: increment(1) });
      } catch {}

      // Cloudinary raw URL ko fl_attachment se force download karао
      const downloadUrl = note.pdfUrl.includes("cloudinary.com")
        ? note.pdfUrl.replace("/raw/upload/", "/raw/upload/fl_attachment/")
        : note.pdfUrl;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("PDF available nahi hai is note ke liye!");
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white px-6 py-12">
      <div className="max-w-4xl mx-auto relative z-10">

        <motion.a href="/#notes" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 text-gray-200 hover:text-white transition-colors mb-8">
          ← Back to Notes
        </motion.a>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="rounded-2xl p-8 mb-6"
          style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", border: `1px solid rgba(255,255,255,0.15)`, borderTop: `4px solid ${color}` }}>

          <div className="flex items-center gap-3 flex-wrap mb-4">
            <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ backgroundColor: `${color}30`, color }}>
              {note.category}
            </span>
            {note.downloads > 0 && (
              <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: "rgba(255,255,255,0.08)", color: "#aaa", border: "1px solid rgba(255,255,255,0.1)" }}>
                ⬇️ {note.downloads} downloads
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white">{note.title}</h1>

          <div>
            {blocks.length > 0
              ? blocks.map((block: any, i: number) => <ContentBlock key={i} block={block} color={color} />)
              : <p className="text-gray-400">Koi content nahi hai is note mein.</p>}
          </div>

          {note.pdfUrl && (
            <div className="mt-6 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <p className="text-green-400 text-sm font-semibold mb-1">📄 PDF Available</p>
              <p className="text-gray-300 text-xs">Download karke offline padho!</p>
            </div>
          )}

          <ShareButtons title={note.title} noteId={id as string} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex gap-4">
          <button
            className="flex-1 py-4 rounded-2xl font-semibold text-white text-lg transition-all duration-300 hover:scale-105 hover:opacity-90"
            style={{ backgroundColor: color, boxShadow: `0 4px 20px ${color}50` }}
            onClick={handleDownload}>
            {note.pdfUrl ? "⬇️ Download PDF" : "📄 PDF Coming Soon"}
          </button>
          <a href="/#notes"
            className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
            ← Back
          </a>
        </motion.div>

      </div>
    </div>
  );
}
