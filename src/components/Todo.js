/**
 * Todo module
 * @module
 */
import React from "react";
import { useEffect, useState } from "react";
import { storage } from "../firebase";
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";
import dayjs from "dayjs";

/**
 *  A component that show the item of the TodoList
 * @component
 */
export default function Todo({
  todo,
  toggleComplete,
  handleDelete,
  handleEdit,
}) {
  const [newTitle, setNewTitle] = useState(todo.title);
  const [newDescription, setNewDescription] = useState(todo.description);
  const [newDate, setNewDate] = useState(todo.date);
  const [fileUpload, setFileUpload] = useState(null);
  const [files, setFiles] = useState([]);
  const [fileUrls, setFileUrls] = useState([]);

  const handleTitleChange = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setNewTitle(todo.title);
    } else {
      todo.title = "";
      setNewTitle(e.target.value);
    }
  };
  const handleDescriptionChange = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setNewDescription(todo.description);
    } else {
      todo.description = "";
      setNewDescription(e.target.value);
    }
  };
  const handleDateChange = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setNewDate(todo.date);
    } else {
      todo.date = "";
      setNewDate(e.target.value);
    }
  };

  const filesListRef = ref(storage, `${todo.title}/`);

  const handleUpload = () => {
    if (fileUpload === null) return;
    const fileRef = ref(storage, `${todo.title}/${fileUpload.name + v4()}`);
    uploadBytes(fileRef, fileUpload).then((snapshot) => {
      setFiles((prev) => [...prev, snapshot.ref]);
      getDownloadURL(snapshot.ref).then((url) => {
        setFileUrls((prev) => [...prev, url]);
      });
    });
  };

  useEffect(() => {
    listAll(filesListRef).then((res) => {
      res.items.forEach((itemRef) => {
        setFiles((prev) => [...prev, itemRef]);
      });
      res.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setFileUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);

  const handleDeleteFile = (index) => {
    deleteObject(files[index]);
    setFiles(files.filter((item) => item !== files[index]));
    setFileUrls(fileUrls.filter((item) => item !== fileUrls[index]));
  };

  const validatedDate = () => {
    const dateToCheck = dayjs(todo.date);
    const now = dayjs();
    let df = dateToCheck.diff(now);
    // console.log(dayjs(dateToCheck));
    // console.log(df);
    if (df > 0) {
      return todo.date;
    } else {
      return "task expired";
    }
  };

  return (
    <div className="todo">
      <div>
        <div>
          <label htmlFor="title">Title</label>
          <input
            className="todo__text"
            style={{ textDecoration: todo.completed && "line-through" }}
            type="text"
            name="title"
            disabled={todo.completed}
            value={todo.title === "" ? newTitle : todo.title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <label htmlFor="desc">Description</label>
          <input
            className="todo__desc"
            style={{ textDecoration: todo.completed && "line-through" }}
            type="text"
            name="desc"
            disabled={todo.completed}
            value={todo.description === "" ? newDescription : todo.description}
            onChange={handleDescriptionChange}
          />
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <input
            className="todo__date"
            style={{ textDecoration: todo.completed && "line-through" }}
            type="text"
            name="date"
            placeholder="YYYY-MM-DD"
            disabled={todo.completed}
            value={todo.date === "" ? newDate : validatedDate()}
            onChange={handleDateChange}
          />
        </div>
      </div>
      <div>
        <div>
          <input
            className="todo__file"
            type="file"
            disabled={todo.completed}
            onChange={(e) => {
              setFileUpload(e.target.files[0]);
            }}
          />
          <button className="btn-upload" onClick={() => handleUpload()}>
            Upload file
          </button>
        </div>
        <div className="files">
          {fileUrls.map((url, index) => {
            return (
              <div key={v4()}>
                <img src={url} alt="file uploaded" />
                <button className="" onClick={() => handleDeleteFile(index)}>
                  Delete File
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="btn-container">
        <button className="btn" onClick={() => toggleComplete(todo)}>
          Complete
        </button>
        <button
          className="btn"
          onClick={() => handleEdit(todo, newTitle, newDescription, newDate)}
        >
          Edit
        </button>
        <button
          className="btn"
          onClick={() => handleDelete(todo, files, fileUrls)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
