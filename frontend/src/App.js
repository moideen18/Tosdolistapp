import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Todo from "./components/todo/todo"; // ✅ Ensure correct file path
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <Router>
      <>
        <Navbar /> {/* ✅ Navbar remains on all pages */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/todo" element={<Todo />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
