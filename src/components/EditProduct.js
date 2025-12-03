// src/components/EditProduct.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PRODUCTS_PATH } from "../api";

export default function EditProduct(){
  const { id } = useParams();
  const nav = useNavigate();
  const [product, setProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    (async ()=>{
      try {
        const res = await fetch(`${PRODUCTS_PATH}/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch(err){
        console.error(err);
        alert("Could not load product");
      }
    })();
  },[id]);

  if (!product) return <section className="card"><p>Loading...</p></section>;

  const save = async () => {
    setSaving(true);
    try {
      const payload = { name: product.name, sku: product.sku, price: Number(product.price), stock: Number(product.stock) };
      const res = await fetch(`${PRODUCTS_PATH}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Update failed");
      nav("/products");
    } catch(err){
      console.error(err);
      alert("Failed to update");
    } finally{ setSaving(false); }
  };

  return (
    <section className="card">
      <h2>Edit Product</h2>
      <div className="form">
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
        <div className="form-actions">
          <button onClick={save} className="btn" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          <button className="btn secondary" onClick={()=>nav("/products")}>Cancel</button>
        </div>
      </div>
    </section>
  );
}
