"use client";
import { useState } from "react";
import { auth, db } from "../lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { motion } from "framer-motion";

const categories = ["HTML", "CSS", "JavaScript", "C", "C++", "Java", "Python", "MySQL", "DBMS"];

export default function AdminPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const [note, setNote] = useState({ title: "", category: "HTML", description: "" });
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      setError("");
    } catch {
      setError("Wrong email or password!");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const handleAddNote = async () => {
    if (!note.title || !note.description) {
      setError("Sab fields bharo!");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "notes"), {
        title: note.title,
        category: note.category,
        description: note.description,
        createdAt: new Date(),
        downloads: 0,
      });
      setSuccess("Note save ho gaya!");
      setNote({ title: "", category: "HTML", description: "" });
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Note save nahi hua!");
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#16161A] text-white flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#242629] border border-white/10 rounded-2xl p-8 w-full max-w-md"
        >
          <h1 className="text-3xl font-bold mb-2 text-center">
            Admin <span className="text-[#7F5AF0]">Login</span>
          </h1>
          <p className="text-gray-400 text-center text-sm mb-8">Only for Om Awasthi</p>

          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F5AF0] transition-all mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F5AF0] transition-all mb-6"
          />
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-[#7F5AF0] hover:bg-[#6B46E0] rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#16161A] text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold">
            Admin <span className="text-[#7F5AF0]">Dashboard</span>
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-red-500 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            Logout
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#242629] border border-white/10 rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold mb-6 text-[#2CB67D]">Add New Note</h2>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-400 text-sm mb-4">{success}</p>}

          <input
            type="text"
            placeholder="Note Title"
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            className="w-full bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F5AF0] transition-all mb-4"
          />

          <select
            value={note.category}
            onChange={(e) => setNote({ ...note, category: e.target.value })}
            className="w-full bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7F5AF0] transition-all mb-4"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <textarea
            placeholder="Note Description"
            value={note.description}
            onChange={(e) => setNote({ ...note, description: e.target.value })}
            rows={4}
            className="w-full bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F5AF0] transition-all mb-6 resize-none"
          />

          <button
            onClick={handleAddNote}
            disabled={loading}
            className="w-full py-3 bg-[#7F5AF0] hover:bg-[#6B46E0] rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Note 🚀"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}