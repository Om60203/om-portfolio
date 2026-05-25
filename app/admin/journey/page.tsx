"use client";

import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/app/lib/firebase";

export default function AdminJourneyPage() {

  const [year, setYear] = useState("");
  const [text, setText] = useState("");

  const [items, setItems] = useState<any[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);

  // FETCH
  const fetchData = async () => {

    const snapshot = await getDocs(
      collection(db, "journey")
    );

    setItems(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  // SAVE
  const handleSave = async () => {

    if (!year || !text) return;

    // EDIT
    if (editingId) {

      await updateDoc(
        doc(db, "journey", editingId),
        {
          year,
          text,
        }
      );

      setEditingId(null);

    } else {

      // ADD
      await addDoc(
        collection(db, "journey"),
        {
          year,
          text,
        }
      );
    }

    setYear("");
    setText("");

    fetchData();
  };

  // DELETE
  const handleDelete = async (id: string) => {

    await deleteDoc(
      doc(db, "journey", id)
    );

    fetchData();
  };

  // EDIT
  const handleEdit = (item: any) => {

    setYear(item.year);
    setText(item.text);

    setEditingId(item.id);
  };

  return (
    <div className="min-h-screen bg-[#16161A] text-white px-6 py-10">

      <h1 className="text-4xl font-bold mb-10">
        Manage Journey
      </h1>

      {/* FORM */}
      <div className="bg-[#242629] p-6 rounded-2xl mb-10">

        <input
          type="text"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full mb-4 bg-[#16161A] px-4 py-3 rounded-xl"
        />

        <textarea
          placeholder="Journey Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full mb-4 bg-[#16161A] px-4 py-3 rounded-xl"
          rows={5}
        />

        <button
          onClick={handleSave}
          className="px-6 py-3 bg-[#2CB67D] rounded-xl font-semibold"
        >
          {editingId ? "Update" : "Save"}
        </button>

      </div>

      {/* LIST */}
      <div className="flex flex-col gap-4">

        {items.map((item) => (

          <div
            key={item.id}
            className="bg-[#242629] p-5 rounded-2xl flex justify-between items-center"
          >

            <div>
              <h2 className="font-bold text-xl text-[#2CB67D]">
                {item.year}
              </h2>

              <p className="text-gray-400">
                {item.text}
              </p>
            </div>

            <div className="flex gap-3">

              <button
                onClick={() => handleEdit(item)}
                className="px-4 py-2 bg-[#7F5AF0] rounded-xl"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                className="px-4 py-2 bg-red-500 rounded-xl"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}