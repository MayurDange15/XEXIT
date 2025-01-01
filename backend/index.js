require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const adminExitInterview = require("./routes/adminExitInterview");
const adminResignations = require("./routes/adminResignations");
const resignationRoutes = require("./routes/resignationRoutes");
const exitInterviewRoutes = require("./routes/exitInterviewRoutes");

const app = express();
const PORT = process.env.PORT || 8082;
const DB_URI =
  process.env.MONGODB_URL || "mongodb://localhost:27017/resignation-system";
mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected!"))
  .catch((error) => console.log("Error in connecting DB", error));

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminResignations);
app.use("/api/admin", adminExitInterview);
app.use("/api/user", resignationRoutes);
app.use("/api/user", exitInterviewRoutes);

app.listen(PORT, () => {
  console.log(`Backend listening on Port ${PORT}!`);
});
