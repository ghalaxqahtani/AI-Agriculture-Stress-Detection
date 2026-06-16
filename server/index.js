import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import modular routing logic components
import apiRoutes from "./routes/api.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

// Set up absolute folder path variables for cross-platform file server routing
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Global Middleware Configuration
app.use(cors());          // Enables Cross-Origin Resource Sharing for frontend client integration
app.use(express.json());  // Parses incoming requests with JSON payloads

/**
 * Static Files Serving Middleware
 * Exposes the 'uploads' directory publicly, allowing clients to fetch and display uploaded plant images.
 */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/**
 * Application Routing Architecture Modules
 * Separates standard database CRUD operations from computationally heavy machine learning executions.
 */
app.use("/api", apiRoutes); // Handles application core flows (Auth, Records management, Profiles)
app.use("/ai", aiRoutes);   // Handles deep learning predictive pipeline scripts coordination

// Establish the server connection on the designated port listener
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Production server initialized and running on port ${PORT}`);
});