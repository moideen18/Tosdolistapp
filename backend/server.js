// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();

const User = require("./models/user");
const authMiddleware = require("./middleware/auth");
const tasksRoutes = require("./routes/tasks");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/usersDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== Registration Endpoint =====
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Generate a JWT token for the new user
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return token and userId along with the success message
    res.status(201).json({
      success: true,
      message: "Registration successful!",
      token,
      userId: newUser._id,
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
});

// ===== Login Endpoint =====
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password!" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      userId: user._id,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
});

// ===== Mount Task Routes =====
// All /api/tasks endpoints require authentication.
app.use("/api/tasks", authMiddleware, tasksRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
