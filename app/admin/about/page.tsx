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

export default function AdminAboutPage() {

  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");

  const [items, setItems] = useState<any[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);

  // FETCH
  const fetchData = async () => {

    const snapshot = await getDocs(
      collection(db, "aboutCards")
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

    if (!title || !value) return;

    // EDIT
    if (editingId) {

      await updateDoc(
        doc(db, "aboutCards", editingId),
        {
          title,
          value,
        }
      );

      setEditingId(null);

    } else {

      // ADD
      await addDoc(
        collection(db, "aboutCards"),
        {
          title,
          value,
        }
      );
    }

    setTitle("");
    setValue("");

    fetchData();
  };

  // DELETE
  const handleDelete = async (id: string) => {

    await deleteDoc(
      doc(db, "aboutCards", id)
    );

    fetchData();
  };

  // EDIT LOAD
  const handleEdit = (item: any) => {

    setTitle(item.title);
    setValue(item.value);

    setEditingId(item.id);
  };

  return (
    <div className="min-h-screen bg-[#16161A] text-white px-6 py-10">

      <h1 className="text-4xl font-bold mb-10">
        Manage About
      </h1>

      {/* FORM */}
      <div className="bg-[#242629] p-6 rounded-2xl mb-10">

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 bg-[#16161A] px-4 py-3 rounded-xl"
        />

        <input
          type="text"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full mb-4 bg-[#16161A] px-4 py-3 rounded-xl"
        />

        <button
          onClick={handleSave}
          className="px-6 py-3 bg-[#7F5AF0] rounded-xl font-semibold"
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
              <h2 className="font-bold text-xl">
                {item.title}
              </h2>

              <p className="text-gray-400">
                {item.value}
              </p>
            </div>

            <div className="flex gap-3">

              <button
                onClick={() => handleEdit(item)}
                className="px-4 py-2 bg-[#2CB67D] rounded-xl"
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