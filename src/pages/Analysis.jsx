import "../styles/analysis.css";
import Navbar from "../components/Navbar";
import { useState } from "react";

/**
 * Analysis Component
 * Renders the primary dashboard workspace for initiating agricultural image analysis.
 * Manages uploading raw plant images, processing remote AI engine diagnostic pipelines,
 * handling server-side custom validations, and serializing relational records to the backend database.
 */
function Analysis() {
  // State Hooks: Manage multi-state view toggles, analytical results data payloads, and cache variables
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageId, setImageId] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [visibility, setVisibility] = useState("");
  const [result, setResult] = useState(null);

  /**
   * File Upload Input Controller
   * Captures the targeted file object stream, generates an ephemeral UI object URL 
   * string for client rendering, and instantiates a unique string identification hash.
   * @param {Event} e - Synthetic change event context from standard input fields
   */
  const handleUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);

      // Instantiates a local memory reference pointer link to display the image before backend processing
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);

      // Simulates unique relational primary key hashes for indexing the data entity
      const id = "IMG-" + Math.floor(Math.random() * 100000);
      setImageId(id);
    }
  };

  /**
   * AI Computational Trigger Handler
   * Package-wraps the uploaded file stream inside a standard HTML5 FormData structure
   * and asynchronously triggers the high-computation Python neural network predictive routing.
   */
  const handleAnalyze = async () => {
    const userId = localStorage.getItem("userId");

    // Validation Guard: Require authenticated user identity contexts for analysis tracking
    if (!userId) {
      alert("Please login first");
      return;
    }

    if (!image) {
      alert("Please upload image first");
      return;
    }

    try {
      // Package binary data payloads into standard multipart/form-data schemas
      const formData = new FormData();
      formData.append("image", image);

      // Async Request Pipeline: Fire the predictive diagnostic trigger
      const res = await fetch("http://localhost:3001/ai/predict", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      // Custom Python Framework Server-Side Validation: Catch non-plant, blurry, or invalid samples
      if (data.invalid) {
        alert(data.error); // Renders precise diagnostic errors returned from the Python runtime backend
        setImage(null);
        setPreview(null);
        setShowResult(false);
        return;
      }

      // Mutate status fields upon structured operational success
      setResult(data);
      setShowResult(true);

    } catch (error) {
      console.error("AI computational operational routing failed:", error);
      alert("AI server error");
    }
  };

  /**
   * Data Persistence Serializer
   * flattens analytical payload dimensions and transmits a secure record entity transaction 
   * structure across standard CRUD API access points.
   */
  const handleSave = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login first");
      return;
    }

    if (visibility === "") {
      alert("Choose visibility");
      return;
    }

    try {
      const formData = new FormData();

      // Flatten dynamic composite database schema data fields into individual append layers
      formData.append("image", image);
      formData.append("imageId", imageId);
      formData.append("stress", result.stress);
      formData.append("prediction", result.prediction);
      formData.append("damage", result.damage);
      formData.append("actions", (result.actions || []).join(",")); // Flattens array lists into comma-separated text blocks
      formData.append("visibility", visibility);
      formData.append("userId", userId);

      // Serializing Task Request Pipeline: Dispatch entities to the relative MySQL mapper routing layers
      const res = await fetch("http://localhost:3001/api/save", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      alert(data.message);

    } catch (error) {
      console.error("Relational data serialization pipeline failure:", error);
      alert("Server error");
    }
  };

  return (
    <div>
      <Navbar />

      <section className="analysis-page">
        <h1>New Analysis</h1>

        {/* Conditional View Phase 1: Upload Workspace (Active when diagnostic results context is absent) */}
        {!showResult && (
          <div className="upload-center">
            <h3>Upload Plant Image</h3>

            <label className="upload-box">
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleUpload}
                hidden
              />
              <span>Click here to upload image</span>
            </label>

            {preview && (
              <img src={preview} className="preview" alt="Selected Preview" />
            )}

            <button className="analyze-btn" onClick={handleAnalyze}>
              Analyze Image
            </button>
          </div>
        )}

        {/* Conditional View Phase 2: Diagnostic Grid Dashboard (Active following operational success) */}
        {showResult && result && (
          <div className="analysis-grid">
            
            {/* Visual Analytics Content Board (LEFT COLUMN) */}
            <div className="left-card">
              <img src={preview} className="preview" alt="Analyzed Source Instance" />
              <div className="Image-ID">
                <strong>Image ID:</strong> {imageId}
              </div>
            </div>

            {/* AI Insight Metadata Analytics Deck (RIGHT COLUMN) */}
            <div className="right-card">
              <h3 className="result-title">Analysis Result</h3>

              <div className="result-box">
                <span className="label">Stress:</span> {result.stress}
              </div>

              <div className="result-box">
                <span className="label">Damage:</span> {result.damage}
              </div>

              {/* Predictive Insight Card Panel Block */}
              <div className="prediction-container">
                <h4>⚠️ Potential Damage Prediction</h4>
                <p className="prediction-text">{result.prediction}</p>
              </div>

              {/* Action Plan Directive Aggregation Mapping */}
              <div className="actions-box">
                <h4 className="label actions-title">Preventive Actions</h4>
                <ul>
                  {(result.actions || []).map((actionItem, index) => (
                    <li key={index}>{actionItem}</li>
                  ))}
                </ul>
              </div>

              {/* Scope Visibility Privacy Access Controls configuration */}
              <div className="visibility">
                <label>
                  <input
                    type="radio"
                    value="Public"
                    checked={visibility === "Public"}
                    onChange={(e) => setVisibility(e.target.value)}
                  />
                  Public
                </label>

                <label>
                  <input
                    type="radio"
                    value="Private"
                    checked={visibility === "Private"}
                    onChange={(e) => setVisibility(e.target.value)}
                  />
                  Private
                </label>
              </div>

              <button className="save-btn" onClick={handleSave}>
                Save Result
              </button>
            </div>

          </div>
        )}
      </section>
    </div>
  );
}

export default Analysis;