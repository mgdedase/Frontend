// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="nav-left">
        <button 
          className="hambtn" 
          onClick={() => setOpen(o => !o)} 
          aria-label="menu"
        >
          ☰
        </button>

        {/* Inventory text only */}
        <span className="brand-text">Inventory</span>
      </div>

      <nav className={`nav-links ${open ? "open" : ""}`}>

        {/* Dashboard */}
        <Link to="/" className="btn small-btn">Dashboard</Link>

        {/* Page Links */}
        <Link to="/products">Products</Link>
        <Link to="/suppliers">Suppliers</Link>
        <Link to="/orders">Orders</Link>

      </nav>
    </header>
  );
}
