import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../Navbar/Navbar";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("📤 Sending registration request...");
      const response = await axios.post("http://localhost:5000/api/register", formData);
      console.log("✅ Registration successful:", response.data);
      alert("🎉 Registration Successful!");

      // Save the token in localStorage
      localStorage.setItem("token", response.data.token);
      // Redirect to the Todo page
      navigate("/todo");
    } catch (error) {
      console.error("❌ Registration error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "❌ Server error. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <FaUser className="icon" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <FaEnvelope className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span className="toggle-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Sign Up</button>
        </form>
        <p className="login-link">
          Already have an account?{" "}
          <span className="link-text" onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </>
  );
};

export default Register;
