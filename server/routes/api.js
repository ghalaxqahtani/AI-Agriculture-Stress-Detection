import express from "express";
import multer from "multer";
import path from "path";
import db from "../db/DB.js";

const router = express.Router();

// =====================================================
// 📁 1. FILE UPLOAD CONFIGURATION (MULTER)
// =====================================================

/**
 * Configure disk storage engine for Multer to manage saved images.
 * Files are renamed with a unique timestamp to prevent file name collisions.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// =====================================================
// 🔐 2. AUTHENTICATION ROUTERS (LOGIN / SIGNUP / PASSWORD)
// =====================================================

/**
 * @route   POST /login
 * @desc    Authenticates a user with email and password
 * @access  Public
 */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Validation: Check for required request body fields
  if (!email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  // Database Query: Verify matching user credentials
  db.query(
    "SELECT * FROM Users WHERE Email=? AND Password=?",
    [email.toLowerCase(), password],
    (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (results.length === 0) {
        return res.json({ message: "Invalid email or password" });
      }

      // Return successful authentication payload
      res.json({ message: "Login successful", user: results[0] });
    }
  );
});

/**
 * @route   POST /signup
 * @desc    Registers a new user with strict input validation rules
 * @access  Public
 */
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  // Input Validation RegEx Rules
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameRegex = /^[A-Za-z]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;

  if (!name || !email || !password) {
    return res.status(400).send("All fields required");
  }

  if (!nameRegex.test(name)) {
    return res.send("Username must contain letters only");
  }

  if (!emailRegex.test(email)) {
    return res.send("Invalid email format");
  }

  // Domain Validation: Restrict registration to trusted email provider networks
  const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com"];
  const domain = email.split("@")[1]?.toLowerCase();

  if (!domain || !allowedDomains.includes(domain)) {
    return res.send("Email domain not allowed (use gmail, yahoo, outlook)");
  }

  if (!passwordRegex.test(password)) {
    return res.send("Weak password");
  }

  // Validation: Check if the email or username already exists in the system
  db.query(
    "SELECT * FROM Users WHERE Email=? OR UserName=?",
    [email.toLowerCase(), name],
    (err, existing) => {
      if (err) return res.status(500).send("Database error");

      if (existing.length > 0) {
        return res.send("User already exists");
      }

      // Database Action: Insert new record with a generated UUID string identifier
      db.query(
        "INSERT INTO Users (UserId, UserName, Email, Password) VALUES (UUID(), ?, ?, ?)",
        [name, email.toLowerCase(), password],
        (err2) => {
          if (err2) {
            return res.status(500).send("Error creating user");
          }
          res.send("User created successfully");
        }
      );
    }
  );
});

/**
 * @route   POST /changePassword
 * @desc    Updates a user's password record after current credential verification
 * @access  Public
 */
router.post("/changePassword", (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.status(400).send("All fields are required");
  }

  // Verify the identity using old credentials
  db.query(
    "SELECT * FROM Users WHERE Email=? AND Password=?",
    [email.toLowerCase(), oldPassword],
    (err, results) => {
      if (err) return res.status(500).send("Database error");

      if (results.length === 0) {
        return res.send("Old password is incorrect");
      }

      // Update password record for verified user
      db.query(
        "UPDATE Users SET Password=? WHERE Email=?",
        [newPassword, email.toLowerCase()],
        (err2) => {
          if (err2) {
            return res.status(500).send("Error updating password");
          }
          res.send("Password updated successfully");
        }
      );
    }
  );
});

// =====================================================
// 📸 3. IMAGE & ANALYSIS PERSISTENCE MANAGEMENT
// =====================================================

/**
 * @route   POST /save
 * @desc    Persists processed images and their corresponding AI diagnosis into the relational database
 * @access  Public
 */
router.post("/save", upload.single("image"), (req, res) => {
  const { imageId, stress, prediction, damage, visibility, userId, actions } = req.body;

  if (!req.file) return res.status(400).json({ error: "No image file provided" });

  const filePath = "/uploads/" + req.file.filename;
  const visibilityId = visibility === "Public" ? 1 : 2; // Maps visibility settings to relational database lookup keys

  // Integrity Check: Prevent duplicate record insertion for the same image identifier
  db.query(
    "SELECT * FROM Results WHERE ImageId=?",
    [imageId],
    (err, rows) => {
      if (rows && rows.length > 0) {
        return res.json({ message: "Already saved" });
      }

      // Relational Insert Task 1: Save core image path and structural attributes
      db.query(
        "INSERT INTO Images (ImageId, UserId, FilePath, Resolution, UploadedAt) VALUES (?,?,?,?,NOW())",
        [imageId, userId, filePath, "N/A"],
        (err1) => {
          if (err1) return res.status(500).json({ error: "Insert image entity failed" });

          // Relational Insert Task 2: Store related AI prediction metrics linked to the parent image entity
          db.query(
            "INSERT INTO Results (ResultId, ImageId, UserId, StressType, Prediction, DamageLevel, PreventiveActions, CreatedAt, VisibilityId) VALUES (UUID(),?,?,?,?,?,?,NOW(),?)",
            [imageId, userId, stress, prediction, damage, actions || "", visibilityId],
            (err2) => {
              if (err2) return res.status(500).json({ error: "Insert result details failed" });

              res.json({ message: "Saved successfully" });
            }
          );
        }
      );
    }
  );
});

/**
 * @route   GET /search
 * @desc    Queries saved analyses matching criteria or filtering by public scope visibility settings
 * @access  Public
 */
router.get("/search", (req, res) => {
  const { id, userId } = req.query;

  db.query(
    `SELECT Images.*, Results.StressType, Results.DamageLevel, Results.VisibilityId
     FROM Images
     JOIN Results ON Images.ImageId = Results.ImageId
     WHERE (Images.UserId = ? OR Results.VisibilityId = 1)
     AND Images.ImageId LIKE ?`,
    [userId, `%${id}%`],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Data query error" });
      }
      res.json(results);
    }
  );
});

// =====================================================
// 📊 4. REPORT SYSTEM ENDPOINTS
// =====================================================

/**
 * @route   GET /report/:id
 * @desc    Fetches diagnostic data summary reports for a specific image instance
 * @access  Public
 */
router.get("/report/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    `SELECT Results.*, Images.FilePath
     FROM Results
     JOIN Images ON Results.ImageId = Images.ImageId
     WHERE Results.ImageId=?`,
    [id],
    (err, results) => {
      if (results.length === 0) {
        return res.status(404).json({ error: "Report data entity not found" });
      }

      const row = results[0];

      // Parse string array structures back into standard JSON arrays before delivery
      res.json({
        stress: row.StressType,
        prediction: row.Prediction,
        damage: row.DamageLevel,
        image: row.FilePath,
        actions: row.PreventiveActions ? row.PreventiveActions.split(",") : []
      });
    }
  );
});

// =====================================================
// 👤 5. USER PROFILE ENDPOINTS
// =====================================================

/**
 * @route   GET /user/:id
 * @desc    Retrieves a historical collection log of diagnostic tasks run by a specific user profile
 * @access  Public
 */
router.get("/user/:id", (req, res) => {
  db.query(
    `SELECT Images.ImageId, Images.FilePath, Results.Prediction, Results.CreatedAt
     FROM Images
     JOIN Results ON Images.ImageId = Results.ImageId
     WHERE Images.UserId=?`,
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database retrieval error" });

      res.json(results);
    }
  );
});

export default router;