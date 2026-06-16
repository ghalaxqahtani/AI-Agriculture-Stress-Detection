import express from "express";
import multer from "multer";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Configure absolute directory paths to ensure cross-platform compatibility (macOS/Linux/Windows)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Multer disk storage for processing uploaded plant images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

/**
 * @route   POST /predict
 * @desc    Handles image upload, triggers the Python Deep Learning script, and returns stress analysis results
 * @access  Public
 */
router.post("/predict", upload.single("image"), (req, res) => {
  
  // Validation: Ensure an image file was included in the request
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  // Define absolute system paths for both the uploaded image and the AI prediction script
  const imagePath = path.resolve(__dirname, "..", "uploads", req.file.filename);
  const scriptPath = path.resolve(__dirname, "..", "ai", "predict.py");

  console.log(`🚀 Initializing environmental stress analysis for image: ${req.file.filename}`);

  // Execute the Python AI script using a child process execution
  exec(`python3 "${scriptPath}" "${imagePath}"`, (error, stdout, stderr) => {
    
    // Log outputs to the server console for tracking and debugging
    console.log("=== Python Engine Output (stdout) ===");
    console.log(stdout); 

    // Handle runtime or system execution errors
    if (error) {
      console.log("❌ Python script execution failed:", error.message);
      return res.status(500).json({ 
        error: "AI Execution failed", 
        details: error.message 
      });
    }

    // Log Python warnings or non-blocking standard errors (e.g., framework warnings)
    if (stderr) {
      console.error("⚠️ Python Engine standard error logs (Stderr):", stderr);
    }

    // Validation: Verify if the AI engine returned any computational results
    if (!stdout || stdout.trim() === "") {
        console.error("❌ Python script returned an empty output. Verify framework dependencies (torch, torchvision, pillow).");
        return res.status(500).json({ error: "Empty result from AI engine" });
    }

    try {
        // Parse the raw standard output from Python into a structured JSON object
        const predictionData = JSON.parse(stdout);
        
        // Respond to the React client application with the prediction data
        res.json(predictionData);

    } catch (e) {
        console.error("❌ Failed to parse JSON output received from Python:", e.message);
        res.status(500).json({ 
            error: "Failed to parse AI result",
            rawOutput: stdout 
        });
    }
  });
});

export default router;