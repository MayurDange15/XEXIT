const express = require("express");
const Resignation = require("../models/Resignation");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Submit Resignation
router.post("/resign", authMiddleware, async (req, res) => {
  const { lwd } = req.body;

  if (req.user.role !== "employee") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const resignation = new Resignation({
      employeeId: req.user.id,
      lwd,
    });
    await resignation.save();
    res.status(200).json({ data: { resignation } });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error submitting resignation", error: error.message });
  }
});

// Get Resignation Details for Logged-In Employee
router.get("/resign", authMiddleware, async (req, res) => {
  if (req.user.role !== "employee") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const resignation = await Resignation.findOne({ employeeId: req.user.id });
    if (!resignation) {
      return res.status(404).json({ message: "No resignation found." });
    }
    res.status(200).json({ data: resignation });
  } catch (error) {
    res
      .status(400)
      .json({
        message: "Error fetching resignation details",
        error: error.message,
      });
  }
});

module.exports = router;
