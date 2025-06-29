import logo from "./logo.svg";
import "./App.css";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  setDoc,
  addDoc,
  query as queryDB,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  where,
  orderBy,
  deleteField,
  startAfter,
  endBefore,
  limit,
  serverTimestamp,
  getCountFromServer,
  documentId,
  increment,
} from "@firebase/firestore";

import { auth, firestore } from "./Services/Firebase";

function App() {
  // Add a new document
  async function addUser() {
    await addDoc(collection(firestore, "users"), {
      name: "Jorden",
      age: 25,
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Firebase</h1>
        <button onClick={addUser}>Add User</button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
