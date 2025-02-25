// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">TODO LIST</Link>
      </div>
      <ul className="navbar-nav">
        <li><Link to="/register" className="nav-link">Register</Link></li>
        <li><Link to="/login" className="nav-link">Login</Link></li>
        
      </ul>
    </nav>
  );
};

export default Navbar;
