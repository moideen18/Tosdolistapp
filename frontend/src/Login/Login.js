import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock } from "react-icons/fa"; 
import "./Login.css"; 

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Checking login credentials...");
      const response = await axios.post("http://localhost:5000/login", formData);

      if (response.data.success) {
        console.log("Login successful:", response.data);
        localStorage.setItem("token", response.data.token);
        alert("Login Successful!");
        navigate("/todo");
      } else {
        setError(response.data.message || "Invalid credentials!");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password. Try again.");
    }
  };

  return (
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
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

export default Login;
