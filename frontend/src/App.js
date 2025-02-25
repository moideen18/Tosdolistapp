import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Todo from "./components/todo/todo";
import Navbar from "./components/Navbar/Navbar"; // Use Navbar component

function App() {
    return (
        <Router>
            {/* If you want the Navbar to be present on every page, you can place it here */}
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/todo" element={<Todo />} />
            </Routes>
        </Router>
    );
}

export default App;
