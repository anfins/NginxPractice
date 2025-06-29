import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../providers/AuthProvider";
import { useNotification } from "../../providers/NotificationProvider";
import "./SignUp.css";

const SignUp = () => {
  const auth = useAuth();
  const notification = useNotification();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /**
   * Log the user out if they go to this page
   */
  useEffect(() => {
    auth.logout();
  }, [auth]);

  /**
   * Sign up the user
   */
  const signup = () => {
    if (validatePassword()) {
      auth.signUpWithEmailAndPassword(email, password, navigate);
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
      notification.warn("Password must have at least 8 characters");
      return false;
    }

    // contain uppercase letters
    if (!/[A-Z]/.test(password)) {
      notification.warn("Password must contain an uppercase letter");
      return false;
    }

    // contain lowercase letters
    if (!/[a-z]/.test(password)) {
      notification.warn("Password must contain a lowercase letter");
      return false;
    }

    // contain numbers
    if (!/\d+/.test(password)) {
      notification.warn("Password must contain a number");
      return false;
    }

    if (password !== confirmPassword) {
      notification.warn("Passwords do not match");
      return false;
    }

    return true;
  };

  /**
   * Gets the jsx for an AuthForm navLink
   *
   * @returns {any} jsx for the navLink of an AuthForm component
   */
  const getNavLink = () => {
    return (
      <p className="text-small text-gray">
        Already a member?&nbsp;
        <Link className="text-small no-underline" to="/login">
          Log in
        </Link>
      </p>
    );
  };

  /**
   * Gets the jsx for an AuthForm footer
   *
   * @returns {any} jsx for the footer of an AuthForm component
   */
  const getFooter = () => {};

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
      </form>
    </div>
  );
};

export default SignUp;
