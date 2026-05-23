"use client";
import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";

const categories = ["HTML", "CSS", "JavaScript", "C", "C++", "Java", "Python", "MySQL", "DBMS"];

const CLOUD_NAME = "dtmh6nggt";
const UPLOAD_PRESET = "u7yd2mgb";

export default function AdminPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [note, setNote] = useState({ title: "", category: "HTML", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("add");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchNotes = async () => {
    const snapshot = await getDocs(collection(db, "notes"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setNotes(data);
  };

  const handleLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      setError("");
      fetchNotes();
    } catch {
      setError("Wrong email or password!");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const uploadPDF = async (): Promise<string> => {
    if (!pdfFile) return "";
    setUploading(true);
    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("resource_type", "raw");
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setUploading(false);
    return data.secure_url || "";
  };

  const handleSaveNote = async () => {
    if (!note.title || !note.description) {
      setError("Sab fields bharo!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      let pdfUrl = "";
      if (pdfFile) {
        pdfUrl = await uploadPDF();
      }

      if (editingId) {
        const updateData: any = {
          title: note.title,
          category: note.category,
          description: note.description,
        };
        if (pdfUrl) updateData.pdfUrl = pdfUrl;
        await updateDoc(doc(db, "notes", editingId), updateData);
        setSuccess("Note update ho gaya!");
        setEditingId(null);
      } else {
        await addDoc(collection(db, "notes"), {
          title: note.title,
          category: note.category,
          description: note.description,
          pdfUrl: pdfUrl,
          createdAt: new Date(),
          downloads: 0,
        });
        setSuccess("Note save ho gaya!");
      }
      setNote({ title: "", category: "HTML", description: "" });
      setPdfFile(null);
      fetchNotes();
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Kuch error aaya!");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Pakka delete karna hai?")) return;
    await deleteDoc(doc(db, "notes", id));
    setSuccess("Note delete ho gaya!");
    fetchNotes();
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleEdit = (n: any) => {
    setNote({ title: n.title, category: n.category, description: n.description });
    setEditingId(n.id);
    setActiveTab("add");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#16161A] text-white flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#242629] border border-white/10 rounded-2xl p-8 w-full max-w-md"
        >
          <h1 className="text-3xl font-bold mb-2 text-center">Admin <span className="text-[#7F5AF0]">Login</span></h1>
          <p className="text-gray-400 text-center text-sm mb-8">Only for Om Awasthi</p>
          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F5AF0] transition-all mb-4" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F5AF0] transition-all mb-6" />
          <button onClick={handleLogin} className="w-full py-3 bg-[#7F5AF0] hover:bg-[#6B46E0] rounded-xl font-semibold transition-all duration-300 hover:scale-105">Login</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#16161A] text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin <span className="text-[#7F5AF0]">Dashboard</span></h1>
          <button onClick={handleLogout} className="px-4 py-2 border border-red-500 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300">Logout</button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#242629] border border-white/10 rounded-2xl p-6 text-center">
            <p className="text-4xl font-bold text-[#7F5AF0]">{notes.length}</p>
            <p className="text-gray-400 text-sm mt-1">Total Notes</p>
          </div>
          <div className="bg-[#242629] border border-white/10 rounded-2xl p-6 text-center">
            <p className="text-4xl font-bold text-[#2CB67D]">{categories.length}</p>
            <p className="text-gray-400 text-sm mt-1">Categories</p>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button onClick={() => setActiveTab("add")} className={`px-6 py-2 rounded-xl font-semibold transition-all ${activeTab === "add" ? "bg-[#7F5AF0] text-white" : "bg-[#242629] text-gray-400"}`}>
            {editingId ? "Edit Note" : "Add Note"}
          </button>
          <button onClick={() => { setActiveTab("list"); fetchNotes(); }} className={`px-6 py-2 rounded-xl font-semibold transition-all ${activeTab === "list" ? "bg-[#7F5AF0] text-white" : "bg-[#242629] text-gray-400"}`}>
            All Notes ({notes.length})
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-400 text-sm mb-4">{success}</p>}

        {activeTab === "add" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#242629] border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6 text-[#2CB67D]">{editingId ? "Edit Note" : "Add New Note"}</h2>

            <input type="text" placeholder="Note Title" value={note.title} onChange={(e) => setNote({ ...note, title: e.target.value })} className="w-full bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F5AF0] transition-all mb-4" />

            <select value={note.category} onChange={(e) => setNote({ ...note, category: e.target.value })} className="w-full bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7F5AF0] transition-all mb-4">
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            <textarea placeholder="Note Description" value={note.description} onChange={(e) => setNote({ ...note, description: e.target.value })} rows={4} className="w-full bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F5AF0] transition-all mb-4 resize-none" />

            {/* PDF Upload */}
            <div className="border border-dashed border-[#7F5AF0]/50 rounded-xl p-4 mb-6 text-center">
              <p className="text-gray-400 text-sm mb-2">📄 PDF Upload karo</p>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className="text-gray-300 text-sm"
              />
              {pdfFile && <p className="text-green-400 text-sm mt-2">✅ {pdfFile.name}</p>}
              {uploading && <p className="text-yellow-400 text-sm mt-2">Uploading PDF...</p>}
            </div>

            <div className="flex gap-4">
              <button onClick={handleSaveNote} disabled={loading || uploading} className="flex-1 py-3 bg-[#7F5AF0] hover:bg-[#6B46E0] rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50">
                {loading ? "Saving..." : editingId ? "Update Note" : "Save Note"}
              </button>
              {editingId && (
                <button onClick={() => { setEditingId(null); setNote({ title: "", category: "HTML", description: "" }); setPdfFile(null); }} className="px-6 py-3 border border-white/20 rounded-xl font-semibold hover:border-red-500 transition-all">
                  Cancel
                </button>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "list" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
            {notes.length === 0 ? (
              <p className="text-gray-400 text-center py-12">Koi note nahi hai abhi!</p>
            ) : (
              notes.map((n) => (
                <div key={n.id} className="bg-[#242629] border border-white/10 rounded-2xl p-5 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-1 rounded-full bg-[#7F5AF0]/20 text-[#7F5AF0] font-semibold">{n.category}</span>
                      {n.pdfUrl && <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">📄 PDF</span>}
                    </div>
                    <h3 className="font-bold text-lg">{n.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{n.description}</p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button onClick={() => handleEdit(n)} className="px-4 py-2 bg-[#2CB67D] hover:bg-[#24A06D] rounded-xl text-sm font-semibold transition-all">Edit</button>
                    <button onClick={() => handleDelete(n.id)} className="px-4 py-2 bg-red-500/20 hover:bg-red-500 border border-red-500/50 rounded-xl text-sm font-semibold text-red-400 hover:text-white transition-all">Delete</button>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}