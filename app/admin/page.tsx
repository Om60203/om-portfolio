"use client";
import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";

const CLOUD_NAME = "dtmh6nggt";
const UPLOAD_PRESET = "u7yd2mgb";

const DEFAULT_COLORS: { [key: string]: string } = {
  HTML: "#E34F26", CSS: "#1572B6", JavaScript: "#F7DF1E",
  C: "#A8B9CC", "C++": "#00599C", Java: "#ED8B00",
  Python: "#3776AB", MySQL: "#4479A1", DBMS: "#2CB67D",
  Excel: "#217346", Word: "#2B579A", "UI/UX": "#FF6B6B",
};

type BlockType = "text" | "code" | "image";
interface Block { type: BlockType; value: string }

function BlockEditor({ blocks, setBlocks }: { blocks: Block[]; setBlocks: (b: Block[]) => void }) {
  const addBlock = (type: BlockType) => setBlocks([...blocks, { type, value: "" }]);
  const updateBlock = (index: number, value: string) => {
    const updated = [...blocks]; updated[index] = { ...updated[index], value }; setBlocks(updated);
  };
  const removeBlock = (index: number) => setBlocks(blocks.filter((_, i) => i !== index));
  const moveBlock = (index: number, direction: "up" | "down") => {
    const updated = [...blocks]; const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= updated.length) return;
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]]; setBlocks(updated);
  };
  return (
    <div className="mb-4">
      <div className="flex gap-2 mb-4 flex-wrap">
        <span className="text-gray-400 text-sm self-center">Block add karo:</span>
        <button type="button" onClick={() => addBlock("text")} className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#7F5AF0]/20 text-[#7F5AF0] border border-[#7F5AF0]/40 hover:bg-[#7F5AF0]/40 transition-all">✏️ Write</button>
        <button type="button" onClick={() => addBlock("code")} className="px-4 py-2 rounded-xl text-sm font-semibold bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-green-500/40 transition-all">💻 Code</button>
        <button type="button" onClick={() => addBlock("image")} className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/40 hover:bg-blue-500/40 transition-all">🖼️ Image URL</button>
      </div>
      {blocks.length === 0 && <p className="text-gray-500 text-sm text-center py-6 border border-dashed border-white/10 rounded-xl">Upar se block add karo (Write / Code / Image)</p>}
      {blocks.map((block, i) => (
        <div key={i} className="mb-3 rounded-xl overflow-hidden border" style={{ borderColor: block.type === "text" ? "rgba(127,90,240,0.4)" : block.type === "code" ? "rgba(44,182,125,0.4)" : "rgba(59,130,246,0.4)" }}>
          <div className="px-4 py-2 flex items-center justify-between text-xs font-semibold" style={{ background: block.type === "text" ? "rgba(127,90,240,0.15)" : block.type === "code" ? "rgba(44,182,125,0.15)" : "rgba(59,130,246,0.15)", color: block.type === "text" ? "#7F5AF0" : block.type === "code" ? "#2CB67D" : "#60A5FA" }}>
            <span>{block.type === "text" ? "✏️ Write" : block.type === "code" ? "💻 Code" : "🖼️ Image URL"}</span>
            <div className="flex gap-1">
              <button type="button" onClick={() => moveBlock(i, "up")} className="px-2 py-1 rounded hover:bg-white/10">↑</button>
              <button type="button" onClick={() => moveBlock(i, "down")} className="px-2 py-1 rounded hover:bg-white/10">↓</button>
              <button type="button" onClick={() => removeBlock(i)} className="px-2 py-1 rounded hover:bg-red-500/30 text-red-400">✕</button>
            </div>
          </div>
          {block.type === "text" && <textarea placeholder="Yahan apna note likhao..." value={block.value} onChange={(e) => updateBlock(i, e.target.value)} rows={4} className="w-full bg-[#16161A] px-4 py-3 text-white placeholder-gray-500 focus:outline-none resize-y text-sm" />}
          {block.type === "code" && <textarea placeholder="Yahan code likhao..." value={block.value} onChange={(e) => updateBlock(i, e.target.value)} rows={5} className="w-full bg-[#0d0d0d] px-4 py-3 text-green-300 placeholder-gray-600 focus:outline-none resize-y text-sm" style={{ fontFamily: "monospace" }} />}
          {block.type === "image" && <input type="text" placeholder="Image ka URL paste karo (https://...)" value={block.value} onChange={(e) => updateBlock(i, e.target.value)} className="w-full bg-[#16161A] px-4 py-3 text-white placeholder-gray-500 focus:outline-none text-sm" />}
        </div>
      ))}
    </div>
  );
}

export default function AdminPanel() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null); const [error, setError] = useState(""); const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("add");

  // Notes
  const [notes, setNotes] = useState<any[]>([]); const [title, setTitle] = useState(""); const [category, setCategory] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]); const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); const [pdfFile, setPdfFile] = useState<File | null>(null); const [uploading, setUploading] = useState(false);

  // Categories
  const [categories, setCategories] = useState<any[]>([]); const [newCatName, setNewCatName] = useState(""); const [catLoading, setCatLoading] = useState(false);

  // About
  const [aboutCards, setAboutCards] = useState<any[]>([]); const [aboutTitle, setAboutTitle] = useState(""); const [aboutIcon, setAboutIcon] = useState(""); const [aboutShortDesc, setAboutShortDesc] = useState("");
  const [journeyItems, setJourneyItems] = useState<any[]>([]); const [journeyYear, setJourneyYear] = useState(""); const [journeyTitle, setJourneyTitle] = useState("");

  // Projects
  const [projects, setProjects] = useState<any[]>([]);
  const [proj, setProj] = useState({ title: "", description: "", details: "", icon: "🚀", color: "#7F5AF0", github: "", live: "", tagline: "", tech: "", features: "" });
  const [projImages, setProjImages] = useState<string[]>([]);
  const [projEditId, setProjEditId] = useState<string | null>(null);
  const [projLoading, setProjLoading] = useState(false);

  const showSuccess = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(""), 3000); };

  const fetchNotes = async () => { const s = await getDocs(collection(db, "notes")); setNotes(s.docs.map((d) => ({ id: d.id, ...d.data() }))); };
  const fetchCategories = async () => {
    const s = await getDocs(collection(db, "categories")); const cats = s.docs.map((d) => ({ id: d.id, ...d.data() }));
    setCategories(cats); if (cats.length > 0 && !category) setCategory((cats[0] as any).name);
  };
  const fetchAboutData = async () => {
    const cs = await getDocs(collection(db, "about_cards")); setAboutCards(cs.docs.map((d) => ({ id: d.id, ...d.data() })));
    const js = await getDocs(collection(db, "journey")); setJourneyItems(js.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => a.year - b.year));
  };
  const fetchProjects = async () => { const s = await getDocs(collection(db, "projects")); setProjects(s.docs.map((d) => ({ id: d.id, ...d.data() }))); };

  const handleLogin = async () => {
    try {
      const r = await signInWithEmailAndPassword(auth, email, password);
      setUser(r.user); setError(""); fetchNotes(); fetchCategories(); fetchAboutData(); fetchProjects();
    } catch { setError("Wrong email or password!"); }
  };
  const handleLogout = async () => { await signOut(auth); setUser(null); };

  const uploadPDF = async (): Promise<string> => {
    if (!pdfFile) return ""; setUploading(true);
    const fd = new FormData(); fd.append("file", pdfFile); fd.append("upload_preset", UPLOAD_PRESET); fd.append("resource_type", "auto");
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, { method: "POST", body: fd });
    const data = await res.json(); setUploading(false); return data.secure_url || "";
  };

  // Notes CRUD
  const handleSaveNote = async () => {
    if (!title.trim()) { setError("Title bharo!"); return; } if (!category) { setError("Category select karo!"); return; }
    if (blocks.length === 0) { setError("Ek block add karo!"); return; }
    setLoading(true); setError("");
    try {
      let pdfUrl = ""; if (pdfFile) pdfUrl = await uploadPDF();
      if (editingId) {
        const u: any = { title, category, content: blocks }; if (pdfUrl) u.pdfUrl = pdfUrl;
        await updateDoc(doc(db, "notes", editingId), u); showSuccess("Note updated! ✅"); setEditingId(null);
      } else {
        await addDoc(collection(db, "notes"), { title, category, content: blocks, pdfUrl, createdAt: new Date(), downloads: 0 });
        showSuccess("Note saved! ✅");
      }
      setTitle(""); setBlocks([]); setPdfFile(null); fetchNotes();
    } catch { setError("Error aaya!"); } setLoading(false);
  };
  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; await deleteDoc(doc(db, "notes", id)); showSuccess("Deleted!"); fetchNotes(); };
  const handleEdit = (n: any) => { setTitle(n.title); setCategory(n.category); setBlocks(Array.isArray(n.content) && n.content.length > 0 ? n.content : n.description ? [{ type: "text", value: n.description }] : []); setEditingId(n.id); setActiveTab("add"); };

  // Categories CRUD
  const handleAddCategory = async () => {
    const name = newCatName.trim(); if (!name) { setError("Naam likho!"); return; }
    if (categories.find((c) => c.name.toLowerCase() === name.toLowerCase())) { setError("Already exists!"); return; }
    setCatLoading(true);
    try { await addDoc(collection(db, "categories"), { name, createdAt: new Date() }); setNewCatName(""); showSuccess(`"${name}" added! ✅`); fetchCategories(); }
    catch { setError("Error!"); } setCatLoading(false);
  };
  const handleDeleteCategory = async (id: string, name: string) => { if (!confirm(`"${name}" delete?`)) return; await deleteDoc(doc(db, "categories", id)); showSuccess("Deleted!"); fetchCategories(); };

  // About CRUD
  const handleSaveAboutCard = async () => {
    if (!aboutTitle || !aboutIcon) { setError("Title aur icon bharo!"); return; }
    try { await addDoc(collection(db, "about_cards"), { title: aboutTitle, icon: aboutIcon, shortDesc: aboutShortDesc, createdAt: new Date() }); showSuccess("Card saved! ✅"); setAboutTitle(""); setAboutIcon(""); setAboutShortDesc(""); fetchAboutData(); }
    catch { setError("Error!"); }
  };
  const handleDeleteAboutCard = async (id: string) => { if (!confirm("Delete?")) return; await deleteDoc(doc(db, "about_cards", id)); showSuccess("Deleted!"); fetchAboutData(); };
  const handleSaveJourney = async () => {
    if (!journeyYear || !journeyTitle) { setError("Year aur title bharo!"); return; }
    try { await addDoc(collection(db, "journey"), { year: journeyYear, title: journeyTitle, createdAt: new Date() }); showSuccess("Journey saved! ✅"); setJourneyYear(""); setJourneyTitle(""); fetchAboutData(); }
    catch { setError("Error!"); }
  };
  const handleDeleteJourney = async (id: string) => { if (!confirm("Delete?")) return; await deleteDoc(doc(db, "journey", id)); showSuccess("Deleted!"); fetchAboutData(); };

  // Projects CRUD
  const handleSaveProject = async () => {
    if (!proj.title.trim()) { setError("Project title bharo!"); return; }
    setProjLoading(true); setError("");
    try {
      const techArr = proj.tech.split(",").map((t) => t.trim()).filter(Boolean);
      const featArr = proj.features.split("\n").map((f) => f.trim()).filter(Boolean);
      const data: any = { title: proj.title, description: proj.description, details: proj.details, icon: proj.icon, color: proj.color, github: proj.github, live: proj.live, tagline: proj.tagline, tech: techArr, features: featArr, images: projImages, createdAt: new Date() };
      if (projEditId) { await updateDoc(doc(db, "projects", projEditId), data); showSuccess("Project updated! ✅"); setProjEditId(null); }
      else { await addDoc(collection(db, "projects"), data); showSuccess("Project saved! ✅"); }
      setProj({ title: "", description: "", details: "", icon: "🚀", color: "#7F5AF0", github: "", live: "", tagline: "", tech: "", features: "" });
      setProjImages([]); fetchProjects();
    } catch { setError("Error aaya!"); } setProjLoading(false);
  };
  const handleDeleteProject = async (id: string) => { if (!confirm("Delete project?")) return; await deleteDoc(doc(db, "projects", id)); showSuccess("Project deleted!"); fetchProjects(); };
  const handleEditProject = (p: any) => {
    setProj({ title: p.title || "", description: p.description || "", details: p.details || "", icon: p.icon || "🚀", color: p.color || "#7F5AF0", github: p.github || "", live: p.live || "", tagline: p.tagline || "", tech: (p.tech || []).join(", "), features: (p.features || []).join("\n") });
    setProjImages(p.images || []); setProjEditId(p.id); setActiveTab("projects");
  };

  // ── Login ──
  if (!user) return (
    <div className="min-h-screen bg-[#16161A] text-white flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-[#242629] border border-white/10 rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center">Admin <span className="text-[#7F5AF0]">Login</span></h1>
        <p className="text-gray-400 text-center text-sm mb-8">Only for Om Awasthi</p>
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F5AF0] mb-4" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F5AF0] mb-6" />
        <button onClick={handleLogin} className="w-full py-3 bg-[#7F5AF0] hover:bg-[#6B46E0] rounded-xl font-semibold transition-all hover:scale-105">Login</button>
      </motion.div>
    </div>
  );

  // ── Dashboard ──
  return (
    <div className="min-h-screen bg-[#16161A] text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin <span className="text-[#7F5AF0]">Dashboard</span></h1>
          <button onClick={handleLogout} className="px-4 py-2 border border-red-500 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">Logout</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[{ label: "Notes", value: notes.length, color: "#7F5AF0" }, { label: "Projects", value: projects.length, color: "#2CB67D" }, { label: "Categories", value: categories.length, color: "#F5A623" }, { label: "PDF Notes", value: notes.filter(n => n.pdfUrl).length, color: "#E44D7B" }].map((s) => (
            <div key={s.label} className="bg-[#242629] border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-gray-400 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <button onClick={() => setActiveTab("add")} className={`px-5 py-2 rounded-xl font-semibold transition-all text-sm ${activeTab === "add" ? "bg-[#7F5AF0] text-white" : "bg-[#242629] text-gray-400"}`}>{editingId ? "✏️ Edit Note" : "➕ Add Note"}</button>
          <button onClick={() => { setActiveTab("list"); fetchNotes(); }} className={`px-5 py-2 rounded-xl font-semibold transition-all text-sm ${activeTab === "list" ? "bg-[#7F5AF0] text-white" : "bg-[#242629] text-gray-400"}`}>📋 Notes ({notes.length})</button>
          <button onClick={() => { setActiveTab("projects"); fetchProjects(); }} className={`px-5 py-2 rounded-xl font-semibold transition-all text-sm ${activeTab === "projects" ? "bg-[#2CB67D] text-white" : "bg-[#242629] text-gray-400"}`}>{projEditId ? "✏️ Edit Project" : "🚀 Add Project"}</button>
          <button onClick={() => { setActiveTab("projectList"); fetchProjects(); }} className={`px-5 py-2 rounded-xl font-semibold transition-all text-sm ${activeTab === "projectList" ? "bg-[#2CB67D] text-white" : "bg-[#242629] text-gray-400"}`}>🗂️ Projects ({projects.length})</button>
          <button onClick={() => { setActiveTab("categories"); fetchCategories(); }} className={`px-5 py-2 rounded-xl font-semibold transition-all text-sm ${activeTab === "categories" ? "bg-[#F5A623] text-black" : "bg-[#242629] text-gray-400"}`}>📁 Categories ({categories.length})</button>
          <button onClick={() => { setActiveTab("about"); fetchAboutData(); }} className={`px-5 py-2 rounded-xl font-semibold transition-all text-sm ${activeTab === "about" ? "bg-yellow-500 text-black" : "bg-[#242629] text-gray-400"}`}>👤 About CMS</button>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-400 text-sm mb-4">{success}</p>}

        {/* ── ADD NOTE ── */}
        {activeTab === "add" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#242629] border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6 text-[#2CB67D]">{editingId ? "✏️ Edit Note" : "➕ Add New Note"}</h2>
            <input type="text" placeholder="Note Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F5AF0] mb-4" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7F5AF0] mb-6">
              <option value="">-- Category select karo --</option>
              {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
            </select>
            {categories.length === 0 && <p className="text-yellow-400 text-sm mb-4">⚠️ Pehle Categories tab mein category add karo!</p>}
            <p className="text-sm font-semibold text-gray-300 mb-3">📝 Note Content</p>
            <BlockEditor blocks={blocks} setBlocks={setBlocks} />
            <div className="border border-dashed border-[#7F5AF0]/50 rounded-xl p-4 mb-6 text-center">
              <p className="text-gray-400 text-sm mb-2">📄 PDF Upload (optional)</p>
              <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} className="text-gray-300 text-sm" />
              {pdfFile && <p className="text-green-400 text-sm mt-2">✅ {pdfFile.name}</p>}
              {uploading && <p className="text-yellow-400 text-sm mt-2">Uploading...</p>}
            </div>
            <div className="flex gap-4">
              <button onClick={handleSaveNote} disabled={loading || uploading} className="flex-1 py-3 bg-[#7F5AF0] hover:bg-[#6B46E0] rounded-xl font-semibold disabled:opacity-50">{loading ? "Saving..." : editingId ? "Update Note" : "Save Note"}</button>
              {editingId && <button onClick={() => { setEditingId(null); setTitle(""); setBlocks([]); setPdfFile(null); }} className="px-6 py-3 border border-white/20 rounded-xl font-semibold hover:border-red-500">Cancel</button>}
            </div>
          </motion.div>
        )}

        {/* ── NOTES LIST ── */}
        {activeTab === "list" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
            {notes.length === 0 ? <p className="text-gray-400 text-center py-12">Koi note nahi!</p> : notes.map((n) => (
              <div key={n.id} className="bg-[#242629] border border-white/10 rounded-2xl p-5 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs px-2 py-1 rounded-full bg-[#7F5AF0]/20 text-[#7F5AF0] font-semibold">{n.category}</span>
                    {n.pdfUrl && <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">📄 PDF</span>}
                    {Array.isArray(n.content) && <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">{n.content.length} blocks</span>}
                  </div>
                  <h3 className="font-bold text-lg">{n.title}</h3>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleEdit(n)} className="px-4 py-2 bg-[#2CB67D] hover:bg-[#24A06D] rounded-xl text-sm font-semibold">Edit</button>
                  <button onClick={() => handleDelete(n.id)} className="px-4 py-2 bg-red-500/20 hover:bg-red-500 border border-red-500/50 rounded-xl text-sm font-semibold text-red-400 hover:text-white">Delete</button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── ADD PROJECT ── */}
        {activeTab === "projects" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#242629] border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6 text-[#2CB67D]">{projEditId ? "✏️ Edit Project" : "🚀 Add Project"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input placeholder="Project Title *" value={proj.title} onChange={(e) => setProj({ ...proj, title: e.target.value })} className="bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#2CB67D]" />
              <input placeholder="Tagline (short)" value={proj.tagline} onChange={(e) => setProj({ ...proj, tagline: e.target.value })} className="bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#2CB67D]" />
              <input placeholder="Icon emoji 🚀" value={proj.icon} onChange={(e) => setProj({ ...proj, icon: e.target.value })} className="bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#2CB67D]" />
              <div className="flex items-center gap-3 bg-[#16161A] border border-white/10 rounded-xl px-4 py-3">
                <label className="text-gray-400 text-sm">Color:</label>
                <input type="color" value={proj.color} onChange={(e) => setProj({ ...proj, color: e.target.value })} className="w-10 h-8 rounded cursor-pointer bg-transparent border-0" />
                <span className="text-gray-300 text-sm">{proj.color}</span>
              </div>
            </div>
            <textarea placeholder="Short Description *" value={proj.description} onChange={(e) => setProj({ ...proj, description: e.target.value })} rows={3} className="w-full bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#2CB67D] mb-4 resize-none" />
            <textarea placeholder="Detailed Description (View page pe dikhega)" value={proj.details} onChange={(e) => setProj({ ...proj, details: e.target.value })} rows={5} className="w-full bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#2CB67D] mb-4 resize-y" />
            <input placeholder="Tech Stack (React, Firebase, Tailwind)" value={proj.tech} onChange={(e) => setProj({ ...proj, tech: e.target.value })} className="w-full bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#2CB67D] mb-4" />
            <textarea placeholder="Features (har feature new line mein)" value={proj.features} onChange={(e) => setProj({ ...proj, features: e.target.value })} rows={4} className="w-full bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#2CB67D] mb-4 resize-y" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input placeholder="GitHub URL" value={proj.github} onChange={(e) => setProj({ ...proj, github: e.target.value })} className="bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#2CB67D]" />
              <input placeholder="Live Demo URL" value={proj.live} onChange={(e) => setProj({ ...proj, live: e.target.value })} className="bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#2CB67D]" />
            </div>
            {/* Images */}
            <div className="mb-6">
              <p className="text-sm text-gray-300 mb-2">🖼️ Project Images (URL add karo)</p>
              {projImages.map((img, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input value={img} onChange={(e) => { const u = [...projImages]; u[i] = e.target.value; setProjImages(u); }} placeholder="Image URL" className="flex-1 bg-[#16161A] border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none text-sm" />
                  <button onClick={() => setProjImages(projImages.filter((_, j) => j !== i))} className="px-3 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500 hover:text-white text-sm">✕</button>
                </div>
              ))}
              <button onClick={() => setProjImages([...projImages, ""])} className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded-xl text-sm hover:bg-blue-500/40">+ Image add karo</button>
            </div>
            <div className="flex gap-4">
              <button onClick={handleSaveProject} disabled={projLoading} className="flex-1 py-3 bg-[#2CB67D] hover:bg-[#24A06D] rounded-xl font-semibold disabled:opacity-50">{projLoading ? "Saving..." : projEditId ? "Update Project" : "Save Project"}</button>
              {projEditId && <button onClick={() => { setProjEditId(null); setProj({ title: "", description: "", details: "", icon: "🚀", color: "#7F5AF0", github: "", live: "", tagline: "", tech: "", features: "" }); setProjImages([]); }} className="px-6 py-3 border border-white/20 rounded-xl font-semibold hover:border-red-500">Cancel</button>}
            </div>
          </motion.div>
        )}

        {/* ── PROJECT LIST ── */}
        {activeTab === "projectList" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
            {projects.length === 0 ? <p className="text-gray-400 text-center py-12">Koi project nahi!</p> : projects.map((p) => (
              <div key={p.id} className="bg-[#242629] border border-white/10 rounded-2xl p-5 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl">{p.icon}</span>
                    <h3 className="font-bold text-lg">{p.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm">{(p.description || "").substring(0, 80)}...</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {(p.tech || []).slice(0, 4).map((t: string, i: number) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${p.color}20`, color: p.color, border: `1px solid ${p.color}40` }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleEditProject(p)} className="px-4 py-2 bg-[#2CB67D] hover:bg-[#24A06D] rounded-xl text-sm font-semibold">Edit</button>
                  <button onClick={() => handleDeleteProject(p.id)} className="px-4 py-2 bg-red-500/20 hover:bg-red-500 border border-red-500/50 rounded-xl text-sm font-semibold text-red-400 hover:text-white">Delete</button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── CATEGORIES ── */}
        {activeTab === "categories" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#242629] border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6 text-[#2CB67D]">🗂️ Manage Categories</h2>
            <div className="flex gap-3 mb-8">
              <input type="text" placeholder="Naya course naam likhao..." value={newCatName} onChange={(e) => setNewCatName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddCategory()} className="flex-1 bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#2CB67D]" />
              <button onClick={handleAddCategory} disabled={catLoading} className="px-6 py-3 bg-[#2CB67D] hover:bg-[#24A06D] rounded-xl font-semibold disabled:opacity-50">{catLoading ? "Adding..." : "➕ Add"}</button>
            </div>
            {categories.length === 0 ? <p className="text-gray-400 text-center py-8">Koi category nahi!</p> : (
              <div className="flex flex-col gap-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between px-5 py-4 rounded-xl border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: DEFAULT_COLORS[cat.name] || "#7F5AF0" }} />
                      <span className="font-semibold text-white">{cat.name}</span>
                    </div>
                    <button onClick={() => handleDeleteCategory(cat.id, cat.name)} className="px-4 py-2 bg-red-500/20 hover:bg-red-500 border border-red-500/50 rounded-xl text-sm font-semibold text-red-400 hover:text-white">Delete</button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-gray-500 text-xs mt-6">💡 Category delete karne se notes delete nahi honge.</p>
          </motion.div>
        )}

        {/* ── ABOUT CMS ── */}
        {activeTab === "about" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-[#242629] border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6 text-yellow-400">👤 About Cards</h2>
              <input type="text" placeholder="Title (jaise: Education)" value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} className="w-full mb-4 bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F5AF0]" />
              <input type="text" placeholder="Icon (🎓)" value={aboutIcon} onChange={(e) => setAboutIcon(e.target.value)} className="w-full mb-4 bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F5AF0]" />
              <input type="text" placeholder="Short Description" value={aboutShortDesc} onChange={(e) => setAboutShortDesc(e.target.value)} className="w-full mb-4 bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F5AF0]" />
              <button onClick={handleSaveAboutCard} className="px-6 py-3 bg-[#7F5AF0] hover:bg-[#6B46E0] rounded-xl font-semibold">Save Card</button>
              <h3 className="text-lg font-bold mt-8 mb-4 text-[#7F5AF0]">All Cards ({aboutCards.length})</h3>
              {aboutCards.length === 0 ? <p className="text-gray-400 text-sm">Koi card nahi!</p> : (
                <div className="flex flex-col gap-3">
                  {aboutCards.map((card) => (
                    <div key={card.id} className="flex items-center justify-between bg-[#16161A] rounded-xl px-4 py-3 border border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{card.icon}</span>
                        <div><p className="font-semibold text-white">{card.title}</p><p className="text-gray-400 text-xs">{card.shortDesc}</p></div>
                      </div>
                      <button onClick={() => handleDeleteAboutCard(card.id)} className="px-3 py-1 bg-red-500/20 hover:bg-red-500 border border-red-500/50 rounded-xl text-xs font-semibold text-red-400 hover:text-white">Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-[#242629] border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6 text-[#2CB67D]">🗓️ Journey</h2>
              <input type="text" placeholder="Year (2024)" value={journeyYear} onChange={(e) => setJourneyYear(e.target.value)} className="w-full mb-4 bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#2CB67D]" />
              <input type="text" placeholder="Journey description" value={journeyTitle} onChange={(e) => setJourneyTitle(e.target.value)} className="w-full mb-4 bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#2CB67D]" />
              <button onClick={handleSaveJourney} className="px-6 py-3 bg-[#2CB67D] hover:bg-[#24A06D] rounded-xl font-semibold">Save Journey</button>
              <h3 className="text-lg font-bold mt-8 mb-4 text-[#2CB67D]">All Journey ({journeyItems.length})</h3>
              {journeyItems.length === 0 ? <p className="text-gray-400 text-sm">Koi journey nahi!</p> : (
                <div className="flex flex-col gap-3">
                  {journeyItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-[#16161A] rounded-xl px-4 py-3 border border-white/10">
                      <div><span className="text-[#7F5AF0] font-bold mr-3">{item.year}</span><span className="text-white text-sm">{item.title}</span></div>
                      <button onClick={() => handleDeleteJourney(item.id)} className="px-3 py-1 bg-red-500/20 hover:bg-red-500 border border-red-500/50 rounded-xl text-xs font-semibold text-red-400 hover:text-white">Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
