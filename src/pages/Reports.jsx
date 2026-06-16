import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Reports.css";
import html2pdf from "html2pdf.js";

/**
 * Reports Component
 * Provides an interface to query, retrieve, and inspect localized crop diagnostic reports.
 * Features a programmatic PDF serialization pipeline (`html2pdf.js`) that captures DOM nodes,
 * toggles view controls dynamically during compilation to preserve layouts, and downloads structural documents.
 */
function Reports() {
  // State Hooks: Manage text query entries, API entity payloads, and result rendering conditional states
  const [imageId, setImageId] = useState("");
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // =====================================================
  // 📅 CURRENT TEMPORAL LOGGING
  // =====================================================
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  // =====================================================
  // 🔍 DATA RETRIEVAL PIPELINE (SEARCH)
  // =====================================================
  
  /**
   * Queries the backend operational endpoints using specific image identifier parameters.
   * Updates state data nodes upon structural matching or catches explicit HTTP exception codes.
   */
  const searchReport = async () => {
    // Guard Clause Validation: Enforce non-empty identifier checks
    if (imageId.trim() === "") {
      alert("Please enter Image ID");
      return;
    }

    try {
      // Async Request Channel: Target standard reporting entity models
      const response = await fetch(`http://localhost:3001/api/report/${imageId}`);

      // Handle custom HTTP state exception mapping
      if (response.status === 404) {
        alert("Image not found");
        setShowResult(false);
        return;
      }

      if (!response.ok) {
        throw new Error("HTTP connection pipeline failure during record query");
      }

      const data = await response.json();

      // Mutate state configurations to reflect successful data load
      setResult(data);
      setShowResult(true);

    } catch (error) {
      console.error("Analytical report document synchronization failure:", error);
      alert("Server error");
    }
  };

  // =====================================================
  // 📄 DOCUMENT SERIALIZATION PIPELINE (PDF)
  // =====================================================
  
  /**
   * Captures targeted layout nodes from the DOM tree, suppresses administrative controls,
   * configures high-fidelity canvas scale options, and compiles binary data blobs to local client downlinks.
   */
  const downloadReport = () => {
    const element = document.querySelector(".report-card");
    const button = document.querySelector(".download-btn");

    if (!element) return;

    // Layout Optimization: Temporarily suppress interactive action nodes to exclude buttons from final documents
    if (button) button.style.display = "none";

    // Structural configuration options for html2pdf orchestration framework
    const opt = {
      margin: 0.5,
      filename: `report-${imageId}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true }, // useCORS enables remote dynamic cross-origin assets compilation
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    };

    // Framework Compilation Stream Execution Pipeline
    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        // Layout Restoration: Re-enable functional control views upon pipeline completion
        if (button) button.style.display = "block";
      });
  };

  // =====================================================
  // 🎨 USER INTERFACE RENDERING LAYERS
  // =====================================================
  return (
    <div>
      {/* Global Application Navigation Header */}
      <Navbar />

      <h1 className="report-title">Plant Stress Report</h1>

      <div className="reports-container">
        
        {/* Search Parameter Capture Bar */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter Image ID"
            value={imageId}
            onChange={(e) => setImageId(e.target.value)}
          />
          <button onClick={searchReport}>Search</button>
        </div>

        {/* Conditional Rendering Layer: Display certificate view boards following data confirmation */}
        {showResult && result && (
          <div className="report-card">
            
            {/* Document Header Metadata Section */}
            <div className="report-top">
              <div className="logo">
                <img src="/logo5.png" alt="Application Logo Logo" />
              </div>

              <div className="date">
                Date Generated<br />
                {today}
              </div>
            </div>

            <h2>Crop Health Report</h2>
            <p className="report-id">Report ID: {imageId}</p>

            <hr />

            {/* Analyzed Media Block Section */}
            <div className="report-image-center">
              {/* crossOrigin attribute allows html2canvas to safely capture image assets hosted across separate domains */}
              <img 
                src={`http://localhost:3001${result.image}`} 
                crossOrigin="anonymous"
                alt="Analyzed Plant Specimen"
              />
            </div>

            {/* Diagnostic Metrics Meta Container */}
            <div className="report-details-center">
              <h3>Diagnosis</h3>

              <div className="stress-line">
                <span className="stress-name">{result.stress || "N/A"}</span>
                <span className="severity">{result.damage || "N/A"}</span>
              </div>

              <div className="prediction-box">
                "{result.prediction || "No prediction available"}"
              </div>
            </div>

            {/* Action Plan Directive List Array Mapping */}
            <div className="actions-section">
              <h3>Recommended Actions</h3>
              <ol>
                {(result.actions || []).length > 0 ? (
                  result.actions.map((actionItem, index) => (
                    <li key={index}>{actionItem}</li>
                  ))
                ) : (
                  <li>No actions available</li>
                )}
              </ol>
            </div>

            {/* Client File Compilation Downlink Trigger Control */}
            <button className="download-btn" onClick={downloadReport}>
              Download Report
            </button>

          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;