const mongoose = require("mongoose");

const exitInterviewSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  responses: [
    {
      questionText: { type: String, required: true },
      response: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("ExitInterview", exitInterviewSchema);
