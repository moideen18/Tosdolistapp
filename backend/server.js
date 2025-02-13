const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/auth.js"); 
const User = require("./models/user");
const Task = require("./models/task");

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

app.post("/register", async (req, res) => {
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

    res
      .status(201)
      .json({ success: true, message: "Registration successful!" });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
});

app.post("/login", async (req, res) => {
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
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
});

app.use("/api/tasks", authMiddleware, require("./routes/tasks"));

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
