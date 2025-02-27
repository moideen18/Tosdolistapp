const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/db");
const User = require("./models/user");
const authMiddleware = require("./middleware/auth");
const tasksRoutes = require("./routes/tasks");
const { sendMail } = require("./utils/mailer");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

connectDB();

// 📌 Register User & Send Confirmation Email
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, isVerified: false });
    await newUser.save();

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const confirmationLink = `http://localhost:3000/confirm-email?token=${token}`;

    await sendMail(email, "Confirm Your Email", `<a href="${confirmationLink}">Confirm Email</a>`);

    res.status(201).json({ message: "Confirmation email sent!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 Confirm Email
app.get("/api/confirm-email", async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(400).json({ message: "User not found" });

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified!" });
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
});

// 📌 Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.isVerified || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.use("/api/tasks", authMiddleware, tasksRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
