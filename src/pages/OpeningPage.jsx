import "../styles/openingPage.css";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

/**
 * OpeningPage Component
 * Renders the initial public landing screen for unauthenticated platform visitors.
 * Displays the core scientific project title and distributes user traffic smoothly 
 * into the authentication subsystem endpoints (Login / Sign-Up).
 */
function OpeningPage() {
  return (
    <div className="opening">
      {/* Global Application Navigation Bar */}
      <Navbar />

      {/* Main Structural Hero Layout */}
      <div className="opening-content">
        
        {/* Core Scientific Research Title Heading */}
        <h1 className="text1_h1">
          Environmental Stress Detection in Agriculture Using Deep Learning
        </h1>

        {/* System Value Proposition Context */}
        <h3 className="text1_h3">
          Welcome to our AI-powered smart agricultural platform.
          We leverage deep learning and image analysis to detect crop stress early.
        </h3>

        {/* Navigation Action Triggers Funnel */}
        <div className="buttons2-3">
          {/* Direct Route Entry to User Login Interface */}
          <Link to="/login">
            <button className="btn">Login</button>
          </Link>

          {/* Direct Route Entry to User Account Creation Interface */}
          <Link to="/login">
            <button className="btn">Sign Up</button>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default OpeningPage;