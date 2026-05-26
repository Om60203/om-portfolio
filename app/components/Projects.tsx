"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snap = await getDocs(query(collection(db, "projects"), orderBy("createdAt", "desc")));
        setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  return (
    <section className="min-h-screen bg-transparent text-white flex flex-col items-center justify-center px-6 py-20">

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-4"
      >
        My <span className="text-[#7F5AF0]">Projects</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-200 mb-12 text-center"
      >
        Things I have built
      </motion.p>

      {loading ? (
        <p className="text-gray-300 animate-pulse text-lg">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-400 text-lg">Koi project nahi hai abhi!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between"
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{project.icon || "🚀"}</span>
                  <h3 className="text-xl font-bold text-white">{project.title}</h3>
                </div>
                <p className="text-gray-200 text-sm leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {(project.tech || []).map((t: string, j: number) => (
                    <span key={j} className="text-xs px-3 py-1 rounded-full"
                      style={{
                        border: `1px solid ${project.color || "#7F5AF0"}`,
                        color: project.color || "#7F5AF0",
                        backgroundColor: `${project.color || "#7F5AF0"}15`,
                      }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                {/* View Detail Button */}
                <a href={`/projects/${project.id}`}
                  className="flex-1 text-center py-2 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:opacity-90"
                  style={{ backgroundColor: project.color || "#7F5AF0", boxShadow: `0 4px 15px ${project.color || "#7F5AF0"}40` }}>
                  👁️ View
                </a>
                {project.github && project.github !== "#" && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer"
                    className="flex-1 text-center py-2 rounded-xl text-sm font-semibold transition-all duration-300"
                    style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                    🐙 GitHub
                  </a>
                )}
                {project.live && project.live !== "#" && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer"
                    className="flex-1 text-center py-2 rounded-xl text-sm font-semibold text-white transition-all duration-300"
                    style={{ backgroundColor: "#2CB67D", boxShadow: "0 4px 15px #2CB67D40" }}>
                     Live Demo
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
