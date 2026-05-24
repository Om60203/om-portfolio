"use client";
import { useState } from "react";
import { auth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailAuth = async () => {
    if (!email || !password) { setError("Please enter email and password!"); return; }
    setLoading(true); setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (!name) { setError("Please enter your name!"); setLoading(false); return; }
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") setError("User not found!");
      else if (err.code === "auth/wrong-password") setError("Wrong password!");
      else if (err.code === "auth/email-already-in-use") setError("Email already registered!");
      else if (err.code === "auth/weak-password") setError("Password must be at least 6 characters!");
      else setError("Something went wrong. Please try again!");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true); setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch { setError("Google login failed. Please try again!"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen text-white flex items-center justify-center px-6 relative overflow-hidden">

      {/* Animated CSS Background */}
      <style>{`
        .login-bg {
          background: linear-gradient(180deg, #1a0533 0%, #2d1b69 30%, #4a2080 60%, #7b3fa0 80%, #c084e0 100%);
          position: absolute;
          inset: 0;
        }
        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle 2s ease-in-out infinite alternate;
        }
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
        .cloud {
          position: absolute;
          background: rgba(255,255,255,0.15);
          border-radius: 50px;
          animation: floatCloud 8s ease-in-out infinite alternate;
          backdrop-filter: blur(4px);
        }
        .cloud::before, .cloud::after {
          content: '';
          position: absolute;
          background: rgba(255,255,255,0.15);
          border-radius: 50%;
        }
        .cloud::before { width: 60px; height: 60px; top: -20px; left: 20px; }
        .cloud::after { width: 40px; height: 40px; top: -10px; left: 60px; }
        @keyframes floatCloud {
          0% { transform: translateX(0px); }
          100% { transform: translateX(30px); }
        }
        .mountain {
          position: absolute;
          bottom: 0;
          width: 0;
          height: 0;
          border-style: solid;
        }
        .snow-ground {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: linear-gradient(180deg, #c084e0 0%, #e9d5ff 100%);
          border-radius: 60% 60% 0 0;
        }
        .tree {
          position: absolute;
          bottom: 60px;
        }
        .tree-body {
          width: 0;
          height: 0;
          border-left: 20px solid transparent;
          border-right: 20px solid transparent;
          border-bottom: 60px solid #2d1b69;
          margin: 0 auto;
        }
        .tree-trunk {
          width: 8px;
          height: 15px;
          background: #4a2080;
          margin: 0 auto;
        }
        .house {
          position: absolute;
          bottom: 70px;
          right: 80px;
        }
        .house-body {
          width: 60px;
          height: 40px;
          background: #2d1b69;
          border-radius: 4px;
        }
        .house-roof {
          width: 0;
          height: 0;
          border-left: 35px solid transparent;
          border-right: 35px solid transparent;
          border-bottom: 30px solid #4a2080;
          margin: 0 auto;
        }
        .house-window {
          width: 12px;
          height: 12px;
          background: #f59e0b;
          border-radius: 2px;
          position: absolute;
          top: 14px;
          left: 24px;
          box-shadow: 0 0 10px #f59e0b;
        }
        .smoke {
          position: absolute;
          top: -30px;
          left: 20px;
          width: 8px;
          height: 8px;
          background: rgba(255,255,255,0.4);
          border-radius: 50%;
          animation: smokeRise 3s ease-out infinite;
        }
        @keyframes smokeRise {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          100% { transform: translateY(-40px) scale(3); opacity: 0; }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 25px 50px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .glass-input {
          background: rgba(255,255,255,0.1);
          border: none;
          border-bottom: 2px solid rgba(255,255,255,0.4);
          border-radius: 0;
          color: white;
          outline: none;
          transition: border-color 0.3s;
        }
        .glass-input:focus {
          border-bottom-color: white;
        }
        .glass-input::placeholder { color: rgba(255,255,255,0.6); }
      `}</style>

      {/* Background */}
      <div className="login-bg" />

      {/* Stars */}
      {[...Array(20)].map((_, i) => (
        <div key={i} className="star" style={{
          width: Math.random() * 3 + 1 + "px",
          height: Math.random() * 3 + 1 + "px",
          top: Math.random() * 60 + "%",
          left: Math.random() * 100 + "%",
          animationDelay: Math.random() * 2 + "s",
          animationDuration: Math.random() * 2 + 1.5 + "s"
        }} />
      ))}

      {/* Clouds */}
      <div className="cloud" style={{ width: "120px", height: "30px", top: "10%", left: "5%" }} />
      <div className="cloud" style={{ width: "80px", height: "20px", top: "15%", right: "10%", animationDelay: "2s" }} />
      <div className="cloud" style={{ width: "100px", height: "25px", top: "25%", left: "60%", animationDelay: "4s" }} />

      {/* Mountains */}
      <div className="mountain" style={{ borderWidth: "0 120px 180px 120px", borderColor: "transparent transparent #2d1b69 transparent", left: "0px" }} />
      <div className="mountain" style={{ borderWidth: "0 100px 150px 100px", borderColor: "transparent transparent #4a2080 transparent", left: "150px" }} />
      <div className="mountain" style={{ borderWidth: "0 150px 200px 150px", borderColor: "transparent transparent #1a0533 transparent", right: "0px" }} />
      <div className="mountain" style={{ borderWidth: "0 120px 160px 120px", borderColor: "transparent transparent #2d1b69 transparent", right: "150px" }} />

      {/* Snow Ground */}
      <div className="snow-ground" />

      {/* Trees */}
      <div className="tree" style={{ left: "40px" }}>
        <div className="tree-body" />
        <div className="tree-trunk" />
      </div>
      <div className="tree" style={{ left: "90px", bottom: "55px" }}>
        <div className="tree-body" style={{ borderBottomWidth: "80px" }} />
        <div className="tree-trunk" />
      </div>
      <div className="tree" style={{ right: "160px" }}>
        <div className="tree-body" />
        <div className="tree-trunk" />
      </div>

      {/* House */}
      <div className="house">
        <div className="house-roof" />
        <div className="house-body">
          <div className="house-window" />
          <div className="smoke" />
          <div className="smoke" style={{ animationDelay: "1s", left: "25px" }} />
        </div>
      </div>

      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="glass-card relative z-10 w-full max-w-md rounded-3xl p-10"
      >
        <h1 className="text-3xl font-bold text-center mb-8 text-white">
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        {error && (
          <div className="bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-3 mb-4">
            <p className="text-red-300 text-sm">⚠️ {error}</p>
          </div>
        )}

        {!isLogin && (
          <div className="mb-6">
            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="glass-input w-full px-2 py-3 text-white text-sm" />
          </div>
        )}

        <div className="mb-6">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="glass-input w-full px-2 py-3 text-white text-sm" />
        </div>

        <div className="mb-4">
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="glass-input w-full px-2 py-3 text-white text-sm" />
        </div>

        {isLogin && (
          <div className="flex items-center justify-between mb-6 text-xs text-white/60">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-purple-400" />
              Remember Me
            </label>
            <button className="hover:text-white transition-colors font-semibold">Forgot Password?</button>
          </div>
        )}

        <button
          onClick={handleEmailAuth}
          disabled={loading}
          className="w-full py-3 rounded-full font-bold text-purple-900 transition-all duration-300 hover:scale-105 disabled:opacity-50 mb-4"
          style={{ background: "white", boxShadow: "0 4px 20px rgba(255,255,255,0.3)" }}
        >
          {loading ? "Please wait..." : isLogin ? "Log in" : "Create Account"}
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-px bg-white/20" />
          <span className="text-white/50 text-xs">or</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-3 mb-6"
          style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-white/50 text-xs text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => { setIsLogin(!isLogin); setError(""); }} className="text-white font-bold hover:underline">
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}