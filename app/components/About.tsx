"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

import { db } from "../lib/firebase";

import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

export default function About() {

  const [aboutCards, setAboutCards] = useState<any[]>([]);
  const [journey, setJourney] = useState<any[]>([]);

  // ───── FETCH DATA ─────
  useEffect(() => {

    fetchAboutCards();
    fetchJourney();

  }, []);

  // ───── FETCH ABOUT CARDS ─────
  const fetchAboutCards = async () => {

    try {

      const snapshot = await getDocs(
        query(
          collection(db, "about_cards"),
          orderBy("createdAt", "desc")
        )
      );

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAboutCards(data);

    } catch (error) {
      console.log(error);
    }

  };

  // ───── FETCH JOURNEY ─────
  const fetchJourney = async () => {

    try {

      const snapshot = await getDocs(
        query(
          collection(db, "journey"),
          orderBy("createdAt", "desc")
        )
      );

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setJourney(data);

    } catch (error) {
      console.log(error);
    }

  };

  return (

    <section className="min-h-screen bg-transparent text-white px-6 py-20">

      {/* TITLE */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-4 text-center"
      >
        About <span className="text-[#7F5AF0]">Me</span>
      </motion.h2>

      {/* INTRO */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="max-w-2xl mx-auto text-center text-gray-200 text-lg leading-relaxed mb-14"
      >
        I'm <span className="text-white font-semibold">Om Awasthi</span>, a
        BCA student at
        <span className="text-[#7F5AF0]">
          {" "}Allenhouse Business School
        </span>.
        I'm passionate about web development, creating useful tools,
        and sharing knowledge through notes.
      </motion.div>

      {/* INFO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto mb-20">

        {aboutCards.map((item, i) => (

          <Link
            key={item.id}
            href={`/about/${item.id}`}
          >

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: i * 0.15,
              }}
              className="rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(127,90,240,0.3)",
              }}
            >

              <div className="text-5xl mb-4">
                {item.icon}
              </div>

              <p className="text-[#7F5AF0] font-bold text-lg mb-2">
                {item.title}
              </p>

              <p className="text-gray-300 text-sm">
                {item.shortDesc}
              </p>

              <div className="mt-4 text-sm text-[#7F5AF0]">
                Click to view →
              </div>

            </motion.div>

          </Link>

        ))}

      </div>

      {/* TIMELINE TITLE */}
      <motion.h3
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-3xl font-bold mb-10 text-[#2CB67D] text-center"
      >
        My Journey
      </motion.h3>

      {/* TIMELINE */}
      <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">

        {journey.map((item, i) => (

          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: i * 0.15,
            }}
            className="flex gap-4 items-start rounded-2xl p-5 transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >

            {/* YEAR */}
            <div
              className="font-bold text-sm min-w-[50px] mt-1 text-[#7F5AF0]"
            >
              {item.year}
            </div>

            {/* DOT */}
            <div
              className="w-3 h-3 rounded-full mt-2 flex-shrink-0 bg-[#7F5AF0]"
            />

            {/* TEXT */}
            <div className="text-gray-200 text-sm leading-relaxed">
              {item.title}
            </div>

          </motion.div>

        ))}

      </div>

    </section>

  );

}