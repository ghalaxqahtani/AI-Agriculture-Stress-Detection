import "../styles/home.css";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

/**
 * Home Component
 * Renders the global application landing gateway page (Hero banner, core system capabilities, 
 * and a high-visibility call-to-action anchor leading into the primary diagnostic analysis interface).
 */
function Home() {
  return (
    <div>
      {/* Global Application Navigation Header */}
      <Navbar />

      {/* 🚀 Hero Section: Introduction and Value Proposition */}
      <section className="hero">
        <div className="hero-content">
          <h1>AI Crop Stress Detection</h1>
          <p>
            Upload a plant image and let our AI analyze different crop stress conditions 
            such as drought, nutrient deficiency, heat stress, and plant diseases before 
            visible damage appears.
          </p>
        </div>
      </section>

      {/* 🛠️ Features Section: Core Application Technical Capabilities Grid */}
      <section className="features">
        <h2>Why Use Our System</h2>

        <div className="feature-grid">
          {/* Capability Card 1 */}
          <div className="feature-card">
            <h3>Early Detection</h3>
            <p>Identify plant stress before it becomes visible.</p>
          </div>

          {/* Capability Card 2 */}
          <div className="feature-card">
            <h3>AI Analysis</h3>
            <p>Deep learning models analyze plant health from images.</p>
          </div>

          {/* Capability Card 3 */}
          <div className="feature-card">
            <h3>Fast Results</h3>
            <p>Get stress prediction and recommendations in seconds.</p>
          </div>
        </div>
      </section>

      {/* 🎯 Call To Action (CTA) Section: Direct Navigation Link */}
      <section className="cta">
        <h2>Start protecting your crops today</h2>
        <Link to="/analysis" className="main-btn">
          Analyze Plant
        </Link>
      </section>
    </div>
  );
}

export default Home;