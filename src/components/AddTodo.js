/**
 * AddTodo module
 * @module
 */

import React from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";

/**
 *  A component that add data to the Firestore Database
 * @component
 */
export default function AddTodo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title !== "") {
      await addDoc(collection(db, "todos"), {
        title,
        description,
        date,
        completed: false,
      });
      setTitle("");
      setDescription("");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        className="title"
        type="text"
        placeholder="Enter title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="description"
        type="text"
        placeholder="Enter description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        className="date"
        type="date"
        onChange={(e) => setDate(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}
