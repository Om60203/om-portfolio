"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/app/lib/firebase";

export default function AboutDetailPage() {

  const params = useParams();

  const [data, setData] = useState<any>(null);

  // ───── FETCH DATA ─────
  useEffect(() => {

    fetchData();

  }, []);

  const fetchData = async () => {

    try {

      const ref = doc(db, "about_cards", params.id as string);

      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {

        setData(snapshot.data());

      }

    } catch (error) {

      console.log(error);

    }

  };

  // ───── LOADING ─────
  if (!data) {

    return (

      <div className="min-h-screen bg-[#16161A] text-white flex items-center justify-center">

        Loading...

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-[#16161A] text-white px-6 py-20">

      <div className="max-w-4xl mx-auto">

        {/* ICON */}
        <div className="text-6xl mb-6">
          {data.icon}
        </div>

        {/* TITLE */}
        <h1 className="text-4xl font-bold mb-4">
          {data.title}
        </h1>

        {/* SHORT DESC */}
        <p className="text-gray-400 mb-10">
          {data.shortDesc}
        </p>

        {/* BLOCKS */}
        <div className="flex flex-col gap-6">

          {data.blocks?.map((block: any, i: number) => (

            <div key={i}>

              {/* TEXT */}
              {block.type === "text" && (

                <div className="text-gray-200 leading-relaxed text-lg">
                  {block.value}
                </div>

              )}

              {/* CODE */}
              {block.type === "code" && (

                <pre className="bg-black border border-green-500/30 rounded-2xl p-5 overflow-x-auto text-green-400 text-sm">
                  <code>
                    {block.value}
                  </code>
                </pre>

              )}

              {/* IMAGE */}
              {block.type === "image" && (

                <img
                  src={block.value}
                  alt="block"
                  className="rounded-2xl w-full border border-white/10"
                />

              )}

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}