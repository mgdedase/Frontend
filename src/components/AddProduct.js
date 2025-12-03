// src/components/AddProduct.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PRODUCTS_PATH } from "../api";

export default function AddProduct(){
  const [product, setProduct] = useState({ name:"", sku:"", price:"", stock:"" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const nav = useNavigate();

  const validate = () => {
    if (!product.name.trim()) return "Name is required";
    if (!product.sku.trim()) return "SKU is required";
    if (Number(product.stock) < 0) return "Stock must be 0 or more";
    if (Number(product.price) < 0) return "Price must be 0 or more";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) { setError(v); return; }
    setError(""); setSaving(true);
    try {
      const payload = {
        name: product.name.trim(),
        sku: product.sku.trim(),
        price: Number(product.price),
        stock: Number(product.stock)
      };
      const res = await fetch(PRODUCTS_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok){
        const txt = await res.text().catch(()=>null);
        throw new Error(txt || `Status ${res.status}`);
      }
      nav("/products");
    } catch (err) {
      console.error("Create failed", err);
      alert("Failed to create product. See console.");
    } finally { setSaving(false); }
  };

  return (
    <section className="card">
      <h2>Add Product</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>Name
          <input value={product.name} onChange={e=>setProduct({...product, name:e.target.value})} />
        </label>
        <label>SKU
          <input value={product.sku} onChange={e=>setProduct({...product, sku:e.target.value})} />
        </label>
        <label>Price
          <input type="number" step="0.01" value={product.price} onChange={e=>setProduct({...product, price:e.target.value})} />
        </label>
        <label>Stock
          <input type="number" value={product.stock} onChange={e=>setProduct({...product, stock:e.target.value})} />
        </label>
        {error && <div className="error">{error}</div>}
        <div className="form-actions">
          <button type="submit" className="btn" disabled={saving}>{saving ? "Saving..." : "Create"}</button>
          <button type="button" className="btn secondary" onClick={()=>nav("/products")}>Cancel</button>
        </div>
      </form>
    </section>
  );
}
