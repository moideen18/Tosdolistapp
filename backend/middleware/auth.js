// middleware/auth.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });
  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.user = decoded; // decoded should contain { userId: ... }
    next();
  });
};
