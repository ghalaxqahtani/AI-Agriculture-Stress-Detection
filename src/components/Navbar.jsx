import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import UserMenu from "./UserMenu";
import "../styles/navbar.css";

/**
 * Navbar Component
 * Renders the global navigation bar, handles user authentication state representation from localStorage,
 * and manages user profile navigation menus.
 */
function Navbar() {
  const navigate = useNavigate();

  // State Hooks: Manage user session context and dropdown toggle states
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  /**
   * Authentication Lifecycle Effect
   * Checks for an active user session token/email stored in the client's localStorage on component initialization.
   */
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUser(email);
    }
  }, []);

  /**
   * Authentication Sign-Out Handler
   * Clears active authentication cache data tokens from client session storage and redirects to the login route.
   */
  const logout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="header">
      {/* Brand Logo Navigation Anchor */}
      <Link to="/home">
        <img className="logo" src="/logo5.png" alt="Application Logo" />
      </Link>

      {/* Core Operational Routes Group */}
      <div className="header-links">
        <Link to="/home">Home</Link>
        <Link to="/analysis">New Analysis</Link>
        <Link to="/search">Saved Images</Link>

        {/* Conditional Authorization Action Buttons rendering */}
        {user ? (
          <button
            className="account-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            👤 Account
          </button>
        ) : (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        )}
      </div>

      {/* Interactive Account Context Submenu Overlay Hook */}
      {menuOpen && (
        <UserMenu closeMenu={() => setMenuOpen(false)} />
      )}
    </div>
  );
}

export default Navbar;