import "../styles/search.css";
import Navbar from "../components/Navbar";
import { useState } from "react";

/**
 * Search Component
 * Provides a searchable index dashboard for historical crop stress data analysis records.
 * Integrates dynamic categorization filter sub-menus, executes multi-parameter query fetches,
 * and handles interactive analytical inspection modals (popups).
 */
function Search() {
  // State Hooks: Manage text search string criteria, dynamic category filters, results mapping arrays, and modal contexts
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const [stressType, setStressType] = useState("");
  const [subStress, setSubStress] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [details, setDetails] = useState(null);

  // =====================================================
  // 📋 OPTION SELECTION MATRIX (LOOKUP DICTIONARIES)
  // =====================================================
  
  // Relates core environmental agricultural stress families to highly specific analytical sub-classes
  const stressOptions = {
    "Nutrient Deficiency": [
      "Nitrogen Deficiency",
      "Magnesium Deficiency",
      "Potassium Deficiency"
    ],
    "Plant Disease": [
      "Leaf Spot",
      "Powdery Mildew",
      "Mosaic Virus"
    ],
    "Pest Attack": [
      "Aphids",
      "Leaf Miner",
      "Beetle Damage"
    ],
    "Healthy": [
      "Healthy Leaf"
    ]
  };

  // =====================================================
  // 🔍 DATA QUERY PROCESSING PIPELINE
  // =====================================================
  
  /**
   * Compiles selected data filter strings and text criteria parameters, fires an async multi-parameter
   * query fetch to MySQL relational search APIs, and performs data collection validation mapping.
   */
  const handleSearch = async () => {
    const userId = localStorage.getItem("userId");

    // Security Guard: Restrict access metrics tracking strictly to verified user accounts
    if (!userId) {
      alert("Please login first");
      return;
    }

    // Validation Guard: Ensure the user provided at least one parameter string to execute query pipelines
    if (query.trim() === "" && stressType === "" && subStress === "") {
      alert("Please enter an Image ID or choose a filter.");
      return;
    }

    try {
      // Async Request Pipeline: Construct clean multi-parameter query lookup chains
      const res = await fetch(
        `http://localhost:3001/api/search?id=${query}&stress=${stressType}&sub=${subStress}&userId=${userId}`
      );

      if (!res.ok) {
        throw new Error("HTTP resource search pipeline extraction failed");
      }

      const data = await res.json();

      // Data Completeness Check: Validate array dimensions before mutating state targets
      if (!data || data.length === 0) {
        alert("No image found.");
        setResults([]);
        return;
      }

      setResults(data);

    } catch (error) {
      console.error("Historical record index search failure:", error);
      alert("Server connection error");
    }
  };

  // =====================================================
  // 📑 INTERACTIVE INSPECTION MODAL PIPELINES
  // =====================================================
  
  /**
   * Triggers following card element item interactions. Queries detailed report profiles
   * explicitly matching the current structural image identifier parameter to mount inside the view portal overlay.
   * @param {Object} item - Current item dictionary model reference parsed from search result arrays
   */
  const handleCardClick = async (item) => {
    setSelectedItem(item);

    try {
      // Async Request Pipeline: Target explicit report detail endpoints
      const res = await fetch(`http://localhost:3001/api/report/${item.ImageId}`);

      if (!res.ok) {
        throw new Error("HTTP report detail entity resolution failure");
      }

      const data = await res.json();
      setDetails(data);

    } catch (error) {
      console.error("Deep analytics document overlay compilation failure:", error);
      alert("Error loading details");
    }
  };

  // =====================================================
  // 🎨 USER INTERFACE RENDERING LAYERS
  // =====================================================
  return (
    <div>
      {/* Global Application Navigation Header */}
      <Navbar />

      <section className="analysis-text1">
        <h1>Search Saved Images</h1>

        {/* Centralized Search and Filter Control Board Section */}
        <div className="search-card">
          <div className="search-box">
            <input
              type="text"
              placeholder="Enter Image ID"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <button onClick={handleSearch}>Search</button>
            <button onClick={() => setShowFilter(true)}>Filters</button>
          </div>
        </div>

        {/* Dynamic Multi-Card Historical Results Data Display Board */}
        <div className="results-grid">
          {results.map((item) => (
            <div 
              className="result-card" 
              key={item.ImageId}
              onClick={() => handleCardClick(item)}
            >
              {/* Dynamic absolute asset path mapping referencing Node public file assets servers */}
              <img 
                src={`http://localhost:3001${item.FilePath}`} 
                alt="Historical Diagnostic Specimen File" 
              />

              <div className="card-overlay">
                <span></span>
                <span className="status">
                  {item.DamageLevel || "Unknown"}
                </span>
              </div>

              <div className="card-bottom">
                <p>{item.ImageId}</p>
                {/* Relational conditional enum check mapping visibility ID fields directly to text views */}
                <p>{item.VisibilityId == 1 ? "PUBLIC" : "PRIVATE"}</p>
              </div>

              <h3>{item.StressType || "No Data"}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================== */}
      {/* INTERACTIVE UI LAYER: Deep Analytics Modal Inspection Popup Overlay */}
      {/* ===================================================== */}
      {selectedItem && details && (
        <div className="popup">
          <div className="popup-content">
            <button 
              className="close-btn" 
              onClick={() => {
                setSelectedItem(null);
                setDetails(null);
              }}
            >
              X
            </button>

            {/* Render Selected Target Asset (LEFT VIEW PANEL) */}
            <div className="popup-left">
              <img 
                src={`http://localhost:3001${selectedItem.FilePath}`} 
                alt="Selected Specimen Target Instance Enlarged Context Preview"
              />
            </div>

            {/* Render Compiled Relational Records (RIGHT VIEW PANEL) */}
            <div className="popup-right">
              <h3>{details.stress || "N/A"}</h3>
              <p className="damage">Damage: {details.damage || "N/A"}</p>
              <p className="prediction">{details.prediction || "No prediction"}</p>

              {/* Mapped Directive Action Arrays */}
              <ul>
                {(details.actions || []).length > 0 ? (
                  details.actions.map((actionItem, index) => (
                    <li key={index}>{actionItem}</li>
                  ))
                ) : (
                  <li>No actions available</li>
                )}
              </ul>
            </div>

          </div>
        </div>
      )}

      {/* ===================================================== */}
      {/* INTERACTIVE UI LAYER: Scope Category Filter Settings Context Modal Overlay */}
      {/* ===================================================== */}
      {showFilter && (
        <div className="filter-modal">
          <div className="filter-box">
            
            {/* Primary Core Stress Parent Family Category Select Input Box */}
            <select
              value={stressType}
              onChange={(e) => {
                setStressType(e.target.value);
                setSubStress(""); // Flushes child categories values on parent selection changes to retain integrity
              }}
            >
              <option value="">All Categories</option>
              <option value="Nutrient Deficiency">Nutrient Deficiency</option>
              <option value="Plant Disease">Plant Disease</option>
              <option value="Pest Attack">Pest Attack</option>
              <option value="Healthy">Healthy</option>
            </select>

            {/* Secondary Dynamic Agricultural Sub-Stress Type Child Select Input Box */}
            <select
              value={subStress}
              onChange={(e) => setSubStress(e.target.value)}
            >
              <option value="">All Types</option>
              {/* Conditional short-circuit evaluation logic mapping lookups to match selected options */}
              {stressType &&
                stressOptions[stressType].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
            </select>

            <button onClick={() => {
              handleSearch();
              setShowFilter(false);
            }}>
              Search
            </button>
            
            <button onClick={() => setShowFilter(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;