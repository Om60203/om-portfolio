"use client";
import { motion } from "framer-motion";

const skills = [
  { name: "HTML", icon: "🌐", level: 85, color: "#E34F26" },
  { name: "CSS", icon: "🎨", level: 80, color: "#1572B6" },
  { name: "JavaScript", icon: "⚡", level: 70, color: "#F7DF1E" },
  { name: "React", icon: "⚛️", level: 65, color: "#61DAFB" },
  { name: "Next.js", icon: "▲", level: 60, color: "#ffffff" },
  { name: "C", icon: "🔵", level: 75, color: "#A8B9CC" },
  { name: "C++", icon: "🟣", level: 70, color: "#00599C" },
  { name: "Java", icon: "☕", level: 65, color: "#ED8B00" },
  { name: "Python", icon: "🐍", level: 60, color: "#3776AB" },
  { name: "MySQL", icon: "🗄️", level: 65, color: "#4479A1" },
  { name: "DBMS", icon: "📦", level: 60, color: "#2CB67D" },
  { name: "Firebase", icon: "🔥", level: 55, color: "#FFCA28" },
  { name: "GitHub", icon: "🐙", level: 70, color: "#ffffff" },
];

export default function Skills() {
  return (
    <section className="min-h-screen bg-[#0f0f13] text-white flex flex-col items-center justify-center px-6 py-20">

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-4"
      >
        My <span className="text-[#7F5AF0]">Skills</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-400 mb-12 text-center"
      >
        Technologies I have worked with
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {skills.map((skill, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            whileHover={{ scale: 1.05 }}
            className="bg-[#242629] border border-white/10 rounded-2xl p-5 hover:border-[#7F5AF0]/60 transition-all duration-300"
          >
            {/* Icon + Name */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{skill.icon}</span>
              <span className="font-semibold text-lg">{skill.name}</span>
              <span 
                className="ml-auto text-sm font-bold"
                style={{ color: skill.color }}
              >
                {skill.level}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#16161A] rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                transition={{ duration: 1, delay: i * 0.07 }}
                className="h-2 rounded-full"
                style={{ backgroundColor: skill.color }}
              />
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
}