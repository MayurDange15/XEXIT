const express = require("express");
const ExitInterview = require("../models/ExitInterview");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// View Exit Interviews (Admin)
router.get("/exit_responses", authMiddleware, async (req, res) => {
  if (req.user.role !== "hr") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const responses = await ExitInterview.find().populate(
      "employeeId",
      "username"
    );
    res.status(200).json({ data: responses });
  } catch (error) {
    res.status(400).json({
      message: "Error fetching exit interviews",
      error: error.message,
    });
  }
});

module.exports = router;
