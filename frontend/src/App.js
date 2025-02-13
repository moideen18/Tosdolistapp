import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import Register from "./Register/Register";
import Login from "./Login/Login";
import Todo from "./todo"; 

function App() {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<Home />} /> 
                <Route path="/Home" element={<Home />} /> 
                <Route path="/Register" element={<Register />} /> 
                <Route path="/Login" element={<Login />} /> 
                <Route path="/todo" element={<Todo />} />
            </Routes>
        </Router>
    );
}

export default App;
