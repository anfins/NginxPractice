import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../Providers/AuthProvider";
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

import { firestore } from "../Services/Firebase";

const SignUp = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function addUser() {
    await addDoc(collection(firestore, "users"), {
      email: email,
    });
  }

  /**
   * Sign up the user
   */
  const signup = async (event) => {
    event.preventDefault();

    if (validatePassword()) {
      try {
        const userCredential = await auth.signUpWithEmailAndPassword(
          email,
          password
        );
        console.log(userCredential);
        const userId = userCredential.uid;

        await setDoc(doc(firestore, "users", userId), {
          email: email,
        });

        navigate("/");
      } catch (error) {
        console.error("Sign up error:", error);
      }
    }
  };

  /**
   * Checks password validity, ensuring the password contains
   * 8 characters minumum
   * uppercase letters
   * lowercase letters
   * numbers
   * password and confirm password are the same
   *
   * @returns true if valid, otherwise false
   */
  const validatePassword = () => {
    // ensure password is at least 8 characters
    if (password?.length < 8) {
      return false;
    }

    // contain uppercase letters
    if (!/[A-Z]/.test(password)) {
      return false;
    }

    // contain lowercase letters
    if (!/[a-z]/.test(password)) {
      return false;
    }

    // contain numbers
    if (!/\d+/.test(password)) {
      return false;
    }

    if (password !== confirmPassword) {
      return false;
    }

    return true;
  };

  return (
    <div className="auth-container">
      <form onSubmit={signup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(data) => setEmail(data.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(data) => setPassword(data.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(data) => setConfirmPassword(data.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
