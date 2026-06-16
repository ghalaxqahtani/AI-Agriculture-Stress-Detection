import { Link, useNavigate } from "react-router-dom";
import "../styles/UserMenu.css";

/**
 * UserMenu Component
 * Renders an interactive overlay menu for authenticated users, providing quick links 
 * to profile settings, diagnostic reports, and managing the sign-out pipeline.
 * * @param {Function} closeMenu - Callback trigger function to unmount/close the menu modal overlay
 */
function UserMenu({ closeMenu }) {
  const navigate = useNavigate();

  // Retrieve the authorized user's display name cached during the login phase
  const name = localStorage.getItem("userName");

  /**
   * Session Termination Handler
   * Completely clears all client-side authentication caching and active session tokens,
   * then forces a programmatic route redirect back to the gateway login page.
   */
  const logout = () => {
    localStorage.clear(); // Flushes userName, userEmail, and any other structural session tracking keys
    navigate("/login");
  };

  return (
    <div className="menu-overlay">
      <div className="user-menu">
        
        {/* Menu Header: User Identity Profile and Close Control Layout */}
        <div className="user-header">
          <button className="close-btn" onClick={closeMenu}>✕</button>

          {/* Dynamic Avatar UI Indicator: Extracts and displays the first letter of the user's name */}
          <div className="avatar">
            {name?.charAt(0).toUpperCase()}
          </div>

          <h3>{name}</h3>
        </div>

        {/* Account Operation Navigation Mapping Channels */}
        <div className="menu-links">
          <Link to="/profile" onClick={closeMenu}>👤 Personal Page</Link>
          <Link to="/reports" onClick={closeMenu}>📄 Reports</Link>
        </div>

        {/* Global Identity Session Termination Trigger */}
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>

      </div>
    </div>
  );
}

export default UserMenu;