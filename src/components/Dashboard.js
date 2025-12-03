// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { API_BASE, PRODUCTS_PATH } from "../api";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch(PRODUCTS_PATH);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Dashboard product load error:", err);
    }
  };

  // Fetch suppliers
  const fetchSuppliers = async () => {
    try {
      const res = await fetch(`${API_BASE}/suppliers`);
      const data = await res.json();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Dashboard supplier load error:", err);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Dashboard order load error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
    fetchOrders();
  }, []);

  // Product stats
  const totalProducts = products.length;
  const lowStock = products.filter(p => p.stock < 5 && p.stock > 0).length;
  const outOfStock = products.filter(p => p.stock === 0).length;

  // Supplier stats
  const totalSuppliers = suppliers.length;

  // Order stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const completedOrders = orders.filter(o => o.status === "completed").length;

  return (
    <section className="card dashboard">
      <h2>Dashboard</h2>
      <p className="subtext">
        Welcome to your inventory. Monitor stock, suppliers, and orders easily.
      </p>

      {/* MAIN STATS */}
      <div className="dashboard-stats">

        <div className="stat-box">
          <h3>Total Products</h3>
          <p className="number">{totalProducts}</p>
        </div>

        <div className="stat-box">
          <h3>Low Stock Items</h3>
          <p className="number">{lowStock}</p>
        </div>

        <div className="stat-box">
          <h3>Out of Stock</h3>
          <p className="number">{outOfStock}</p>
        </div>

        <div className="stat-box">
          <h3>Total Suppliers</h3>
          <p className="number">{totalSuppliers}</p>
        </div>

        <div className="stat-box">
          <h3>Total Orders</h3>
          <p className="number">{totalOrders}</p>
        </div>

        <div className="stat-box">
          <h3>Pending Orders</h3>
          <p className="number">{pendingOrders}</p>
        </div>

        <div className="stat-box">
          <h3>Completed Orders</h3>
          <p className="number">{completedOrders}</p>
        </div>

      </div>
    </section>
  );
}
