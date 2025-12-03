// src/components/ProductList.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PRODUCTS_PATH } from "../api";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(PRODUCTS_PATH);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data);
    } catch (err) {
      console.error("GET products failed", err);
      alert("Failed to load products. See console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await fetch(`${PRODUCTS_PATH}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      fetchProducts();
    } catch (err) {
      console.error("Delete error", err);
      alert("Failed to delete. See console.");
    }
  };

  return (
    <section className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Products</h2>

        {/* Updated: Add Product replaces Dashboard */}
        <div style={{ display: "flex", gap: 8 }}>
          <Link to="/products/add" className="btn secondary">Add Product</Link>
        </div>
      </div>

      {loading ? (
        <p style={{ marginTop: 12 }}>Loading...</p>
      ) : (
        <>
          {products.length === 0 ? (
            <p style={{ marginTop: 12 }}>No products yet.</p>
          ) : (
            <>
              <div className="product-grid" style={{ marginTop: 12 }}>
                {products.map((p) => (
                  <article className="product-box" key={p._id}>
                    <div className="box-top">
                      <div className="sku">{p.sku}</div>
                      <div className={`stock-pill ${p.stock < 5 ? "low-pill" : ""}`}>
                        {p.stock} in stock
                      </div>
                    </div>

                    <h3 className="box-title">{p.name}</h3>

                    <div className="box-meta">
                      <div className="price">₱{p.price}</div>
                      <div className="muted">ID: {p._id.slice(0, 8)}</div>
                    </div>

                    <div className="box-actions">
                      <Link to={`/products/edit/${p._id}`} className="small">Edit</Link>
                      <button className="small danger" onClick={() => handleDelete(p._id)}>
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {/* Floating add button for mobile */}
              <button
                className="fab"
                title="Add product"
                onClick={() => navigate("/products/add")}
              >
                ＋
              </button>
            </>
          )}
        </>
      )}
    </section>
  );
}

