import "../styles/login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

/**
 * Login Component
 * Provides a unified dual-state form handling user authentication pipelines (Sign-In and Sign-Up).
 * Implements regex input validation patterns, handles asynchronous API server interactions, 
 * and maps session tokens securely into the client's localized memory cache storage.
 */
function Login() {
  const navigate = useNavigate();

  // State Hooks: Manage view configuration layouts and specific user credential inputs
  const [showSignup, setShowSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // =====================================================
  // 🔍 DATA INPUT VALIDATION UTILITIES (REGEX)
  // =====================================================

  /**
   * Validates standard string parameters against standard email schemas.
   * @param {string} email - Target string to evaluate
   * @returns {boolean} True if formatting requirements are satisfied
   */
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  /**
   * Restricts string inputs exclusively to uppercase and lowercase alphabetic symbols.
   * @param {string} name - Target profile name value
   * @returns {boolean} True if string contains alphabetical characters only
   */
  const isValidUsername = (name) => {
    return /^[A-Za-z]+$/.test(name);
  };

  /**
   * Enforces rigorous corporate cryptographic policies for secure profile credentials.
   * Requires: At least 1 uppercase letter, 1 lowercase letter, 1 number, and a minimum of 6 characters.
   * @param {string} password - Raw text sequence to analyze
   * @returns {boolean} True if matching complexity matrices
   */
  const isStrongPassword = (password) => {
    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/.test(password);
  };

  // =====================================================
  // 🔑 AUTHENTICATION LOG-IN HANDLER
  // =====================================================

  /**
   * Processes submission actions to verify profile identities via the backend system endpoint.
   * On validation approval, synchronizes unique identifier payloads to localStorage.
   * @param {Event} e - Submit event architecture
   */
  const handleLogin = async (e) => {
    e.preventDefault();

    // Guard Clause Validation: Enforce required inputs
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Invalid email format");
      return;
    }

    try {
      // Async Execution Pipeline: Request security matching from the backend API gateway
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          email: email.toLowerCase(), // Ensures identity queries remain lower-case normalized
          password 
        })
      });

      const data = await res.json();

      if (data.message === "Login successful") {
        // Secure Cache Persistence: Store localized records for identity state validation tracking
        localStorage.setItem("userId", data.user.UserId);
        localStorage.setItem("userName", data.user.UserName);
        localStorage.setItem("userEmail", data.user.Email);

        // Programmatic routing redirect into personal data dashboard workspace
        navigate("/profile");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Authentication gateway access disruption:", err);
      alert("Server error");
    }
  };

  // =====================================================
  // 📝 NEW USER REGISTRATION HANDLER
  // =====================================================

  /**
   * Coordinates account registration checks, validates credential formatting rules, 
   * and registers fresh unique system identity entities into relational persistence structures.
   * @param {Event} e - Submit event architecture
   */
  const handleSignup = async (e) => {
    e.preventDefault();

    // Guard Clause Validation: Enforce absolute data completeness
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (!isValidUsername(name)) {
      alert("Username must contain letters only");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Invalid email format");
      return;
    }

    if (!isStrongPassword(password)) {
      alert("Password must contain uppercase, lowercase, number and at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Async Request Pipeline: Post structural data payload maps to registration routers
      const res = await fetch("http://localhost:3001/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          name, 
          email: email.toLowerCase(), 
          password 
        })
      });

      const data = await res.text();

      if (data === "User created successfully") {
        alert("Account created successfully");

        // Input Field Cleanup: Flush text states to maintain operational security hygiene
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        // Mutate view configurations back to sign-in rendering views
        setShowSignup(false);
      } else {
        alert(data);
      }
    } catch (err) {
      console.error("Account serialization failure:", err);
      alert("Server error");
    }
  };

  // =====================================================
  // 🎨 USER INTERFACE RENDERING LAYERS
  // =====================================================

  return (
    <div>
      <Navbar />

      <div className="login-wrapper">
        <div className="login-container">
          
          {/* View Toggle Logic Branching: Conditional form layout presentation */}
          {!showSignup ? (
            <>
              {/* PHASE 1: LOGIN COMPONENT FORM SECTION */}
              <h1>Login</h1>
              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button type="submit">Login</button>
              </form>

              <p>
                Don't have an account?{" "}
                <span className="link-btn" onClick={() => setShowSignup(true)}>
                  Sign Up
                </span>
              </p>
            </>
          ) : (
            <>
              {/* PHASE 2: REGISTRATION / SIGNUP COMPONENT FORM SECTION */}
              <h1>Create Account</h1>
              <form onSubmit={handleSignup}>
                <input
                  type="text"
                  placeholder="Username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <button type="submit">Create Account</button>
              </form>

              <p>
                Already have an account?{" "}
                <span className="link-btn" onClick={() => setShowSignup(false)}>
                  Login
                </span>
              </p>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default Login;