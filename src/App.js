// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import ProductList from "./components/ProductList";
import AddProduct from "./components/AddProduct";
import EditProduct from "./components/EditProduct";
import SupplierList from "./components/SupplierList";
import AddSupplier from "./components/AddSupplier";
import EditSupplier from "./components/EditSupplier";
import OrderList from "./components/OrderList";
import OrderDetails from "./components/OrderDetails";


export default function App(){
  return (
    <div className="app-root">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
          <Route path="*" element={<Navigate to="/" replace />} />

          <Route path="/suppliers" element={<SupplierList />} />
          <Route path="/suppliers/add" element={<AddSupplier />} />
          <Route path="/suppliers/edit/:id" element={<EditSupplier />} />

          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
        </Routes>
      </main>
    </div>
  );
}
