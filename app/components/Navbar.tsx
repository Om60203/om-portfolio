"use client";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../lib/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const dropRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const userName = user?.displayName || user?.email?.split("@")[0] || "User";
  const userPhoto = user?.photoURL;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b border-white/10"
      style={{ background: "rgba(26,5,51,0.7)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-white">
          Om <span className="text-[#7F5AF0]">Awasthi</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center">
          <a href="/#home" className="text-gray-200 hover:text-[#7F5AF0] transition-colors duration-300 text-sm font-medium">Home</a>
          <a href="/#about" className="text-gray-200 hover:text-[#7F5AF0] transition-colors duration-300 text-sm font-medium">About</a>
          <a href="/#skills" className="text-gray-200 hover:text-[#7F5AF0] transition-colors duration-300 text-sm font-medium">Skills</a>
          <a href="/#projects" className="text-gray-200 hover:text-[#7F5AF0] transition-colors duration-300 text-sm font-medium">Projects</a>
          <a href="/#notes" className="text-gray-200 hover:text-[#7F5AF0] transition-colors duration-300 text-sm font-medium">Notes</a>
          <a href="/#contact" className="text-gray-200 hover:text-[#7F5AF0] transition-colors duration-300 text-sm font-medium">Contact</a>

          {user ? (
            <div className="relative" ref={dropRef}>
              <button onClick={() => setDropdown(!dropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:bg-white/10">
                {userPhoto ? (
                  <img src={userPhoto} alt={userName} className="w-8 h-8 rounded-full border-2 border-[#7F5AF0]" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#7F5AF0] flex items-center justify-center text-white text-sm font-bold">
                    {userName[0].toUpperCase()}
                  </div>
                )}
                <span className="text-white text-sm font-medium">{userName}</span>
                <span className="text-gray-400 text-xs">{dropdown ? "▲" : "▼"}</span>
              </button>

              {dropdown && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-12 w-48 rounded-2xl overflow-hidden z-50"
                  style={{ background: "rgba(26,5,51,0.95)", border: "1px solid rgba(127,90,240,0.3)", backdropFilter: "blur(20px)" }}>
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white text-sm font-semibold">{userName}</p>
                    <p className="text-gray-400 text-xs">{user.email}</p>
                  </div>
                  <a href="/settings" className="flex items-center gap-2 px-4 py-3 text-gray-200 hover:bg-white/10 text-sm transition-all">
                    ⚙️ Settings
                  </a>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 text-sm transition-all">
                    🚪 Logout
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <a href="/login" className="px-4 py-2 bg-[#7F5AF0] hover:bg-[#6B46E0] rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-105">
              Login
            </a>
          )}
        </div>

        {/* Mobile Nav */}
        <div className="flex items-center gap-3 md:hidden">
          {user ? (
            <button onClick={() => setDropdown(!dropdown)} className="flex items-center gap-2">
              {userPhoto ? (
                <img src={userPhoto} alt={userName} className="w-8 h-8 rounded-full border-2 border-[#7F5AF0]" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#7F5AF0] flex items-center justify-center text-white text-sm font-bold">
                  {userName[0].toUpperCase()}
                </div>
              )}
            </button>
          ) : (
            <a href="/login" className="px-3 py-1 bg-[#7F5AF0] rounded-xl text-xs font-semibold text-white">Login</a>
          )}
          <button onClick={() => setOpen(!open)} className="text-white text-2xl">{open ? "✕" : "☰"}</button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-white/10 px-6 py-4 flex flex-col gap-4"
          style={{ background: "rgba(26,5,51,0.9)" }}>
          <a href="/#home" onClick={() => setOpen(false)} className="text-gray-200 hover:text-[#7F5AF0] text-sm font-medium">Home</a>
          <a href="/#about" onClick={() => setOpen(false)} className="text-gray-200 hover:text-[#7F5AF0] text-sm font-medium">About</a>
          <a href="/#skills" onClick={() => setOpen(false)} className="text-gray-200 hover:text-[#7F5AF0] text-sm font-medium">Skills</a>
          <a href="/#projects" onClick={() => setOpen(false)} className="text-gray-200 hover:text-[#7F5AF0] text-sm font-medium">Projects</a>
          <a href="/#notes" onClick={() => setOpen(false)} className="text-gray-200 hover:text-[#7F5AF0] text-sm font-medium">Notes</a>
          <a href="/#contact" onClick={() => setOpen(false)} className="text-gray-200 hover:text-[#7F5AF0] text-sm font-medium">Contact</a>
          {user && (
            <>
              <a href="/settings" onClick={() => setOpen(false)} className="text-gray-200 hover:text-[#7F5AF0] text-sm font-medium">⚙️ Settings</a>
              <button onClick={handleLogout} className="text-left text-red-400 text-sm font-medium">🚪 Logout</button>
            </>
          )}
        </motion.div>
      )}

      {/* Mobile User Dropdown */}
      {dropdown && user && (
        <div className="md:hidden border-t border-white/10 px-6 py-3" style={{ background: "rgba(26,5,51,0.95)" }}>
          <p className="text-white text-sm font-semibold">{userName}</p>
          <p className="text-gray-400 text-xs mb-2">{user.email}</p>
          <a href="/settings" className="block text-gray-200 text-sm py-1">⚙️ Settings</a>
          <button onClick={handleLogout} className="text-red-400 text-sm py-1">🚪 Logout</button>
        </div>
      )}
    </motion.nav>
  );
}
