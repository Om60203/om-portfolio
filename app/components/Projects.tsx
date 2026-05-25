"use client";
import { motion } from "framer-motion";

const projects = [
  {
    title: "Personal Portfolio & Notes Library",
    description: "Full-stack portfolio website with notes library, borrow/return system, Firebase backend and admin dashboard.",
    tech: ["Next.js", "Firebase", "Tailwind", "TypeScript"],
    icon: "🌐",
    color: "#7F5AF0",
    github: "#",
    live: "#",
  },
  {
    title: "Student Notes Platform",
    description: "A platform where students can upload, share, borrow and download notes with category-wise filtering.",
    tech: ["React", "Firebase", "Node.js"],
    icon: "📚",
    color: "#2CB67D",
    github: "#",
    live: "#",
  },
  {
    title: "Finance Dashboard",
    description: "Analytics dashboard with charts, expense tracking and real-time data visualization.",
    tech: ["React", "Chart.js", "Tailwind"],
    icon: "📊",
    color: "#F5A623",
    github: "#",
    live: "#",
  },
  {
    title: "Online Code Compiler",
    description: "Browser-based code compiler supporting multiple languages with syntax highlighting.",
    tech: ["React", "Node.js", "API"],
    icon: "💻",
    color: "#E44D7B",
    github: "#",
    live: "#",
  },
];

export default function Projects() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {projects.map((project, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{project.icon}</span>
                <h3 className="text-xl font-bold text-white">{project.title}</h3>
              </div>
              <p className="text-gray-200 text-sm leading-relaxed mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((t, j) => (
                  <span
                    key={j}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{
                      border: `1px solid ${project.color}`,
                      color: project.color,
                      backgroundColor: `${project.color}15`
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <a href={project.github} className="flex-1 text-center py-2 rounded-xl text-sm font-semibold transition-all duration-300"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                🐙 GitHub
              </a>
              <a href={project.live} className="flex-1 text-center py-2 rounded-xl text-sm font-semibold text-white transition-all duration-300"
                style={{ backgroundColor: project.color, boxShadow: `0 4px 15px ${project.color}40` }}>
                🚀 Live Demo
              </a>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
}