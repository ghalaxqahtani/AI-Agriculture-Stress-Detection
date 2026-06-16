import Navbar from "../components/Navbar";
import "../styles/profile.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Profile Component
 * Renders the authenticated user's private dashboard. Coordinates data fetching pipelines 
 * to load dynamic historical image diagnostic records from the backend API database views, 
 * provides interface handlers to display media modals, and manages secure password transformation workflows.
 */
function Profile() {
  const navigate = useNavigate();

  // =====================================================
  // 💾 LOCAL STORAGE ENTITY EXTRACTION
  // =====================================================
  const name = localStorage.getItem("userName");
  const email = localStorage.getItem("userEmail");
  const userId = localStorage.getItem("userId");

  // Dynamic localization key indexing targeting cached user analysis counters
  const key = `analysisCount_${userId}`;
  const totalAnalyses = localStorage.getItem(key) || 0;

  // =====================================================
  // ⚡ REACT COMPONENT STATE MATRIX
  // =====================================================
  const [analyses, setAnalyses] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  // =====================================================
  // 📅 DATA FORMATTING UTILITIES
  // =====================================================
  
  /**
   * Sanitizes and parses standard database timestamp values into standardized localized display strings.
   * @param {string} dateString - ISO or database structured date token string
   * @returns {string} Fully readable localized date representation format
   */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // =====================================================
  // 🔐 CLIENT ROUTING SECURITY GUARDS
  // =====================================================
  
  /**
   * Lifecycle Route Guard: Restricts workspace view initialization to valid authorization frames.
   * Automatically bounces unauthenticated traffic layers back to the gateway login interface.
   */
  useEffect(() => {
    if (!userId) {
      alert("Please login first");
      navigate("/login");
    }
  }, [userId, navigate]);

  // =====================================================
  // 📊 REMOTE DATA FETCH PIPELINES
  // =====================================================
  
  /**
   * Data Layer Synchronization Effect: Fetches customized structural arrays of historical diagnostic tasks
   * specifically matching the active authenticated user's relational profile key.
   */
  useEffect(() => {
    if (!userId) return;

    // Asynchronous Fetch Channel to MySQL relational mapper router
    fetch(`http://localhost:3001/api/user/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network data stream pipeline execution failed");
        return res.json();
      })
      .then((data) => {
        // Enforce datatype array integrity patterns before updating layout states
        if (Array.isArray(data)) {
          setAnalyses(data);
        } else {
          setAnalyses([]);
        }
      })
      .catch((error) => {
        console.error("Relational query analytics loading failure:", error);
        setAnalyses([]);
      });
  }, [userId]);

  // =====================================================
  // 🔑 CREDENTIAL REFACTOR PIPELINES
  // =====================================================
  
  /**
   * Processes security payload structures and dispatches standard updates across 
   * identity management API endpoints. Cleans input states upon operational success.
   */
  const changePassword = async () => {
    if (!oldPassword || !newPassword) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      // Dispatch asynchronous JSON payloads securely to backend authentication controllers
      const res = await fetch("http://localhost:3001/api/changePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          oldPassword,
          newPassword
        })
      });

      if (!res.ok) {
        throw new Error("HTTP state transformation response failure");
      }

      const data = await res.text();
      setMessage(data);

      // Graceful Modal Teardown Flow following credential updates validation success
      if (data.includes("successfully")) {
        setTimeout(() => {
          setShowPassword(false);
          setMessage("");
        }, 1500);
      }
    } catch (err) {
      console.error("Security credential synchronization failure:", err);
      setMessage("Error updating password");
    }

    // Flush fields to clear plain-text variables from application state caches
    setOldPassword("");
    setNewPassword("");
  };

  // =====================================================
  // 🎨 USER INTERFACE RENDERING LAYERS
  // =====================================================
  return (
    <div>
      {/* Global Application Navigation Header */}
      <Navbar />

      <div className="profile-container">
        
        {/* LEFT COLUMN: Core Account Profile Deck */}
        <div className="profile-card">
          {/* Dynamic Initials Extraction UI Avatar Block */}
          <div className="profile-avatar">
            {name ? name.charAt(0).toUpperCase() : "U"}
          </div>

          <h2>{name || "User"}</h2>

          <div className="account-card">
            <div className="account-row">
              <span>Email</span>
              <p>{email}</p>
            </div>

            <div className="account-row">
              <span>Member Since</span>
              <p>2025</p>
            </div>

            <button
              className="change-password-btn"
              onClick={() => setShowPassword(true)}
            >
              Change Password
            </button>
          </div>

          {/* Quick Metrics Analytics Tracker Strip */}
          <div className="profile-info">
            <div>
              <strong>Total Analyses</strong>
              <p>{totalAnalyses}</p>
            </div>

            <div>
              <strong>Saved Images</strong>
              <p>{analyses.length}</p>
            </div>

            <div>
              <strong>Last Analysis</strong>
              <p>
                {analyses.length > 0
                  ? formatDate(analyses[0].CreatedAt)
                  : "None"}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Tabular Historical Analytics Log Data List */}
        <div className="analysis-history">
          <h3>Your Analyses</h3>

          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Result</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {/* Conditional Rendering Layer: Evaluate data payload dimensions before mapping layouts */}
              {analyses.length === 0 ? (
                <tr>
                  <td colSpan="3">No analyses yet</td>
                </tr>
              ) : (
                analyses.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="image-box">
                        {/* Dynamic absolute path mapping referencing Node public assets file servers */}
                        <img
                          src={`http://localhost:3001${item.FilePath}`}
                          className="analysis-image"
                          onClick={() => setSelectedImage(`http://localhost:3001${item.FilePath}`)}
                          alt="Historical Analysis Target Instance"
                        />
                        <p className="image-id">{item.ImageId}</p>
                      </div>
                    </td>

                    {/* AI Diagnostic Summary Block Mapping */}
                    <td>{item.Prediction || "N/A"}</td>

                    <td>{formatDate(item.CreatedAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* INTERACTIVE UI LAYER: Media Lightbox View Modal Pop-up Overlay */}
      {selectedImage && (
        <div
          className="image-modal"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} className="modal-image" alt="Enlarged Image Context Preview" />
        </div>
      )}

      {/* INTERACTIVE UI LAYER: Password Update Context Control Modal Overlay */}
      {showPassword && (
        <div className="password-modal">
          <div className="password-box">
            <h3>Change Password</h3>

            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button onClick={changePassword}>Confirm</button>

            <button
              className="cancel-btn"
              onClick={() => setShowPassword(false)}
            >
              Cancel
            </button>

            {/* Error / Operational Success Server Message Response Hooks */}
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;