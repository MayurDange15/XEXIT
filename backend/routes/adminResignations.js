const express = require("express");
const Resignation = require("../models/Resignation");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// View All Resignations (Admin)
router.get("/resignations", authMiddleware, async (req, res) => {
  if (req.user.role !== "hr") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const resignations = await Resignation.find().populate(
      "employeeId",
      "username"
    );
    res.status(200).json({ data: resignations });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error fetching resignations", error: error.message });
  }
});

// Approve/Reject Resignation
router.put("/conclude_resignation", authMiddleware, async (req, res) => {
  const { resignationId, approved, lwd } = req.body;

  if (req.user.role !== "hr") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const resignation = await Resignation.findById(resignationId);
    if (!resignation) {
      return res.status(404).json({ message: "Resignation not found" });
    }

    // resignation.status = approved ? "approved" : "rejected";
    if (approved) {
      resignation.status = "approved";
      resignation.lwd = lwd;
    }

    if (!approved) {
      resignation.status = "rejected";
    }

    // resignation.approvedBy = req.user.id;
    await resignation.save();

    res.status(200).json({ message: "Resignation status updated" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating resignation", error: error.message });
  }
});

module.exports = router;
