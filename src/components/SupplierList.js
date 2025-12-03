import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../api";

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch suppliers
  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/suppliers`);
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      console.error("Error fetching suppliers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Delete supplier
  const deleteSupplier = async () => {
    try {
      await fetch(`${API_BASE}/suppliers/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      fetchSuppliers();
    } catch (err) {
      console.error("Error deleting supplier", err);
    }
  };

  return (
    <section className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Suppliers</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Link to="/suppliers/add" className="btn secondary">Add Supplier</Link>
        </div>
      </div>

      {loading ? (
        <p style={{ marginTop: 12 }}>Loading suppliers...</p>
      ) : suppliers.length === 0 ? (
        <p style={{ marginTop: 12 }}>No suppliers found.</p>
      ) : (
        <div style={{ marginTop: 12 }}>
          {suppliers.map((s) => (
            <div className="product-box" key={s._id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                
                {/* Supplier Info */}
                <div>
                  <strong>{s.name}</strong>
                  <div className="muted">{s.contact} • {s.email}</div>
                </div>

                {/* Edit + Delete Buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Link
                    to={`/suppliers/edit/${s._id}`}
                    className="action-btn"
                    style={{ textDecoration: "none" }}
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => setDeleteId(s._id)}
                    className="action-btn danger"
                    style={{
                      border: "none",
                      background: "transparent",
                      padding: 0,
                      cursor: "pointer",
                      color: "red",
                      textDecoration: "none"
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {deleteId && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Delete Supplier</h3>
            <p>Are you sure you want to delete this supplier?</p>

            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setDeleteId(null)}>
                Cancel
              </button>

              <button className="modal-btn delete" onClick={deleteSupplier}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
