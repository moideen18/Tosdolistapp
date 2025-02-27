import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Navbar from "../Navbar/Navbar";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("📤 Sending login request...");
      const response = await axios.post("http://localhost:5000/api/login", formData);
  
      if (response.data.success) {
        console.log("✅ Login successful:", response.data);
        
        // Check if the user has verified the OTP
        if (response.data.otpVerified) {
          // Save the token in localStorage
          localStorage.setItem("token", response.data.token);
          alert("🎉 Login Successful!");
          navigate("/todo"); // Redirect to Todo page after login
        } else {
          // OTP is not verified, redirect to OTP verification page
          alert("⚠️ Please verify your OTP before logging in.");
          navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
        }
      } else {
        setError(response.data.message || "❌ Login failed. Try again.");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setError("❌ Server error. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
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
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
        </form>
        <p className="register-link">
          Don't have an account?{" "}
          <span className="link-text" onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
    </>
  );
};

export default Login;
