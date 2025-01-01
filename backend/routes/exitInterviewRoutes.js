const express = require("express");
const ExitInterview = require("../models/ExitInterview");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Submit Exit Interview
router.post("/responses", authMiddleware, async (req, res) => {
  if (req.user.role !== "employee") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { responses } = req.body;

  try {
    const exitInterview = new ExitInterview({
      employeeId: req.user.id,
      responses,
    });
    await exitInterview.save();
    res.status(200).json({ message: "Exit interview submitted" });
  } catch (error) {
    res.status(400).json({
      message: "Error submitting exit interview",
      error: error.message,
    });
  }
});

module.exports = router;
