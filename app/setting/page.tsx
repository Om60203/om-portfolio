"use client";
import { useAuth } from "../lib/AuthContext";
import { auth } from "../lib/firebase";
import { signOut, updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (user) setName(user.displayName || user.email?.split("@")[0] || "");
  }, [user, loading]);

  if (loading) return (
    <div className="min-h-screen bg-transparent text-white flex items-center justify-center">
      <p className="animate-pulse text-gray-300">Loading...</p>
    </div>
  );

  if (!user) return null;

  const showSuccess = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(""), 3000); };

  const handleUpdateName = async () => {
    if (!name.trim()) { setError("Naam bharo!"); return; }
    setSaving(true);
    try {
      await updateProfile(user, { displayName: name });
      showSuccess("Naam update ho gaya! ✅");
    } catch { setError("Error aaya!"); }
    setSaving(false);
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) { setError("Dono password bharo!"); return; }
    if (newPassword.length < 6) { setError("New password kam se kam 6 characters!"); return; }
    setSaving(true);
    try {
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      showSuccess("Password change ho gaya! ✅");
      setCurrentPassword(""); setNewPassword("");
    } catch (err: any) {
      if (err.code === "auth/wrong-password") setError("Current password galat hai!");
      else setError("Password update nahi hua!");
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const userName = user.displayName || user.email?.split("@")[0] || "User";
  const isGoogleUser = user.providerData[0]?.providerId === "google.com";

  return (
    <div className="min-h-screen bg-transparent text-white px-6 py-20">
      <div className="max-w-2xl mx-auto">

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8">
          ⚙️ <span className="text-[#7F5AF0]">Settings</span>
        </motion.h1>

        {error && <p className="text-red-400 text-sm mb-4 bg-red-500/10 px-4 py-3 rounded-xl">{error}</p>}
        {success && <p className="text-green-400 text-sm mb-4 bg-green-500/10 px-4 py-3 rounded-xl">{success}</p>}

        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 mb-6"
          style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.12)" }}>

          <div className="flex items-center gap-4 mb-6">
            {user.photoURL ? (
              <img src={user.photoURL} alt={userName} className="w-16 h-16 rounded-full border-2 border-[#7F5AF0]" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#7F5AF0] flex items-center justify-center text-2xl font-bold">
                {userName[0].toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-white font-bold text-lg">{userName}</p>
              <p className="text-gray-400 text-sm">{user.email}</p>
              <span className="text-xs px-2 py-1 rounded-full mt-1 inline-block"
                style={{ background: isGoogleUser ? "rgba(66,133,244,0.2)" : "rgba(127,90,240,0.2)", color: isGoogleUser ? "#4285F4" : "#7F5AF0" }}>
                {isGoogleUser ? "Google Account" : "Email Account"}
              </span>
            </div>
          </div>

          {/* Update Name */}
          <div className="mb-4">
            <label className="text-gray-300 text-sm mb-2 block">Display Name</label>
            <div className="flex gap-3">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7F5AF0]" />
              <button onClick={handleUpdateName} disabled={saving}
                className="px-5 py-3 bg-[#7F5AF0] hover:bg-[#6B46E0] rounded-xl font-semibold text-sm disabled:opacity-50">
                Save
              </button>
            </div>
          </div>
        </motion.div>

        {/* Password Change — only for email users */}
        {!isGoogleUser && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl p-6 mb-6"
            style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <h2 className="text-lg font-bold mb-4 text-[#2CB67D]">🔐 Change Password</h2>
            <input type="password" placeholder="Current Password" value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2CB67D] mb-3" />
            <input type="password" placeholder="New Password (min 6 chars)" value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#16161A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2CB67D] mb-4" />
            <button onClick={handleUpdatePassword} disabled={saving}
              className="px-6 py-3 bg-[#2CB67D] hover:bg-[#24A06D] rounded-xl font-semibold text-sm disabled:opacity-50">
              {saving ? "Saving..." : "Update Password"}
            </button>
          </motion.div>
        )}

        {/* Account Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl p-6 mb-6"
          style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <h2 className="text-lg font-bold mb-4 text-gray-300">ℹ️ Account Info</h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Email</span>
              <span className="text-white">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">User ID</span>
              <span className="text-white text-xs font-mono">{user.uid.substring(0, 16)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Login Type</span>
              <span className="text-white">{isGoogleUser ? "Google" : "Email/Password"}</span>
            </div>
          </div>
        </motion.div>
         {/* Features Section */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.25 }}
  className="grid md:grid-cols-2 gap-4 mb-6"
>

  {/* Upload Notes */}
  <Link href="/setting/upload">
    <div
      className="rounded-2xl p-5 hover:scale-[1.02] transition-all cursor-pointer"
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.12)"
      }}
    >
      <h2 className="text-lg font-bold text-[#7F5AF0] mb-2">
        📚 Upload Notes
      </h2>

      <p className="text-sm text-gray-400">
        Share notes with students
      </p>
    </div>
  </Link>

  {/* Bookmarks */}
 <Link href="/setting/bookmarks">
    <div
      className="rounded-2xl p-5 hover:scale-[1.02] transition-all cursor-pointer"
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.12)"
      }}
    >
      <h2 className="text-lg font-bold text-pink-400 mb-2">
        ❤️ Bookmarks
      </h2>

      <p className="text-sm text-gray-400">
        View saved notes
      </p>
    </div>
  </Link>

  {/* Problems */}
  <Link href="/problems">
    <div
      className="rounded-2xl p-5 hover:scale-[1.02] transition-all cursor-pointer"
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.12)"
      }}
    >
      <h2 className="text-lg font-bold text-yellow-400 mb-2">
        ❓ Problems Community
      </h2>

      <p className="text-sm text-gray-400">
        Ask and solve student doubts
      </p>
    </div>
  </Link>

  {/* Dark Mode */}
  <div
    className="rounded-2xl p-5"
    style={{
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.12)"
    }}
  >
    <h2 className="text-lg font-bold text-cyan-400 mb-2">
      🌙 Dark Mode
    </h2>

    <p className="text-sm text-gray-400 mb-4">
      Customize website appearance
    </p>

    <button
      className="px-4 py-2 rounded-xl bg-[#16161A] border border-white/10 hover:border-cyan-400 transition-all"
    >
      Enabled
    </button>
  </div>

</motion.div>
        {/* Logout */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <button onClick={handleLogout}
            className="w-full py-4 rounded-2xl font-semibold text-red-400 transition-all hover:scale-105"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
            🚪 Logout
          </button>
        </motion.div>

      </div>
    </div>
  );
}
