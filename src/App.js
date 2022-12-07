/**
 * App module
 * @module App
 * @see module:components/Title
 * @see module:components/Todo
 * @see module:components/AddTodo
 */
import React from "react";
import "./App.css";
import AddTodo from "./components/AddTodo";
import Title from "./components/Title";
import Todo from "./components/Todo";
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { useEffect, useState } from "react";
import { deleteObject } from "firebase/storage";

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "todos"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArray);
    });

    return () => unsub();
  }, []);

  const handleEdit = async (todo, title, description, date) => {
    await updateDoc(doc(db, "todos", todo.id), {
      title: title,
      description: description,
      date: date,
    });
  };
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, "todos", todo.id), { completed: !todo.completed });
  };

  const handleDelete = (todo, files, fileUrls) => {
    files.forEach((f) => deleteObject(f));
    files = [];
    fileUrls = [];
    deleteDoc(doc(db, "todos", todo.id));
  };
  return (
    <div className="App">
      <header className="App-header">
        <Title />
      </header>
      <section className="add-todo">
        <AddTodo />
      </section>
      <section className="todo_container">
        {todos.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            toggleComplete={toggleComplete}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        ))}
      </section>
    </div>
  );
}

export default App;
