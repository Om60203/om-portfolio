"use client";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, "projects", id as string));
        if (snap.exists()) setProject({ id: snap.id, ...snap.data() });
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-transparent text-white flex items-center justify-center">
      <p className="animate-pulse text-gray-300 text-xl">Loading...</p>
    </div>
  );

  if (!project) return (
    <div className="min-h-screen bg-transparent text-white flex items-center justify-center">
      <p className="text-red-400 text-xl">Project not found!</p>
    </div>
  );

  const color = project.color || "#7F5AF0";

  return (
    <div className="min-h-screen bg-transparent text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <motion.a href="/#projects" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8">
          ← Back to Projects
        </motion.a>

        {/* Header Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-8 mb-6"
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            border: `1px solid rgba(255,255,255,0.15)`,
            borderTop: `4px solid ${color}`,
          }}>

          {/* Title */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{project.icon || "🚀"}</span>
            <div>
              <h1 className="text-3xl font-bold text-white">{project.title}</h1>
              <p className="text-gray-400 text-sm mt-1">{project.tagline || ""}</p>
            </div>
          </div>

          {/* Tech Stack */}
          {project.tech?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech.map((t: string, i: number) => (
                <span key={i} className="text-xs px-3 py-1 rounded-full font-semibold"
                  style={{ border: `1px solid ${color}`, color, backgroundColor: `${color}15` }}>
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <p className="text-gray-200 leading-relaxed text-base mb-6">{project.description}</p>

          {/* Long Description / Blocks */}
          {project.details && (
            <div className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap mb-6 p-4 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {project.details}
            </div>
          )}

          {/* Images */}
          {Array.isArray(project.images) && project.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {project.images.map((img: string, i: number) => (
                <img key={i} src={img} alt={`${project.title} screenshot ${i + 1}`}
                  className="rounded-xl w-full object-cover border border-white/10 max-h-64" />
              ))}
            </div>
          )}

          {/* Features */}
          {Array.isArray(project.features) && project.features.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-white mb-3">✨ Features</h3>
              <ul className="flex flex-col gap-2">
                {project.features.map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                    <span style={{ color }}>→</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }} className="flex gap-4 flex-wrap">
          {project.github && project.github !== "#" && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="flex-1 py-4 rounded-2xl font-semibold text-center transition-all duration-300 hover:scale-105"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
              🐙 GitHub Repo
            </a>
          )}
          {project.live && project.live !== "#" && (
            <a href={project.live} target="_blank" rel="noopener noreferrer"
              className="flex-1 py-4 rounded-2xl font-semibold text-white text-center transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: color, boxShadow: `0 4px 20px ${color}50` }}>
               Live Demo
            </a>
          )}
          <a href="/#projects"
            className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
            ← Back
          </a>
        </motion.div>

      </div>
    </div>
  );
}
