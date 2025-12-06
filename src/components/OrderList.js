// src/components/OrderList.jsx
import React, { useEffect, useState } from "react";
import { API_BASE } from "../api";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null); // order id being updated

  const STATUS_OPTIONS = ["pending", "processing", "completed", "cancelled"];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/orders`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load orders", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // helpers
  const qtyFor = (it) => Number(it?.qty ?? it?.quantity ?? 0);
  const priceFor = (it) => Number(it?.price ?? it?.unitPrice ?? it?.amount ?? 0);
  const subtotalFor = (it) => qtyFor(it) * priceFor(it);

  const productLabel = (it) => {
    if (!it) return "Unknown product";
    const pid = it.productId ?? it.product ?? null;
    if (!pid) return "Unknown product";
    if (typeof pid === "object") {
      return String(pid.name ?? pid.title ?? pid._id ?? pid.id ?? "[product]");
    }
    return String(pid);
  };

  const supplierInfo = (o) => {
    const s = o?.supplier ?? o?.supplierId ?? null;
    if (!s) return { name: "—", id: "—" };
    if (typeof s === "object") {
      return {
        name: String(s.name ?? s.title ?? (s._id ?? s.id ?? "—")),
        id: String(s._id ?? s.id ?? "—"),
      };
    }
    return { name: String(s), id: String(s) };
  };

  const orderTotal = (order) => {
    const items = Array.isArray(order.items) ? order.items : [];
    return items.reduce((sum, it) => sum + subtotalFor(it), 0);
  };

  const confirmDelete = (id) => setDeleteId(id);

  const deleteOrder = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/orders/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      setDeleteId(null);
      await fetchOrders();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete order. See console.");
    } finally {
      setDeleting(false);
    }
  };

  // Update status handler (PATCH)
  const updateStatus = async (orderId, newStatus) => {
    if (!orderId) return;
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Update failed (${res.status}) ${txt}`);
      }
      // update local state
      setOrders(prev => prev.map(o => ( (o._id ?? o.id) === orderId ? { ...o, status: newStatus } : o )));
    } catch (err) {
      console.error("Status update failed", err);
      alert("Failed to update status. See console.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Orders</h2>
        <div>
          <button className="btn secondary" onClick={fetchOrders} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </button>
          {/* admin doesn't create orders from UI */}
        </div>
      </div>

      {loading ? (
        <p style={{ marginTop: 12 }}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p style={{ marginTop: 12 }}>No orders yet.</p>
      ) : (
        <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
          {orders.map((o) => {
            const id = o._id ?? o.id ?? "—";
            const created = o.createdAt ? new Date(o.createdAt).toLocaleString() : "";
            const items = Array.isArray(o.items) ? o.items : [];
            const total = orderTotal(o);
            const supplier = supplierInfo(o);

            return (
              <div
                key={id}
                className="product-box"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* customer name removed by design earlier; showing created date */}
                    <div className="muted" style={{ fontSize: 13 }}>{created}</div>

                    {/* Editable status select */}
                    <div style={{ marginLeft: 8 }}>
                      <select
                        value={o.status ?? "pending"}
                        onChange={(e) => updateStatus(id, e.target.value)}
                        disabled={updatingId === id}
                        style={{ padding: "6px 8px", borderRadius: 8, cursor: "pointer" }}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {updatingId === id && <span style={{ marginLeft: 8 }}>Saving...</span>}
                    </div>
                  </div>

                  <div className="muted" style={{ marginTop: 10 }}>
                    <strong>Supplier:</strong> {supplier.name}
                    <span className="muted" style={{ marginLeft: 8, fontSize: 12 }}>({supplier.id})</span>
                  </div>

                  <div style={{ marginTop: 10, color: "#e6eef6" }}>
                    <div className="muted" style={{ marginBottom: 6 }}>
                      <strong>Order ID:</strong> {String(id)}
                    </div>

                    <div style={{
                      background: "rgba(255,255,255,0.04)",
                      padding: "8px",
                      borderRadius: "8px",
                      marginTop: "8px"
                    }}>
                      <strong style={{ fontSize: 14 }}>Items</strong>

                      {items.length > 0 ? (
                        items.map((it, idx) => (
                          // render as single text line (ensures spacing)
                          <div key={idx} style={{
                            display: "block",
                            marginTop: 6,
                            fontSize: 13,
                            color: "#e6eef6"
                          }}>
                            { /* Proper spacing and separators */ }
                            {productLabel(it)} &nbsp;•&nbsp; Qty: <strong>{qtyFor(it)}</strong> &nbsp;|&nbsp; Price: <strong>₱{priceFor(it).toLocaleString(undefined, {minimumFractionDigits: 2})}</strong> &nbsp;|&nbsp; Subtotal: <strong>₱{subtotalFor(it).toLocaleString(undefined, {minimumFractionDigits: 2})}</strong>
                          </div>
                        ))
                      ) : (
                        <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
                          No items
                        </div>
                      )}
                    </div>

                    <div className="muted" style={{ fontSize: 13, marginTop: 10 }}>
                      {items.length} item{items.length !== 1 ? "s" : ""} • Grand Total: ₱{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  {/* VIEW BUTTON REMOVED */}
                  <button className="small" onClick={() => confirmDelete(id)} style={{ color: "var(--danger)", background: "transparent", border: "none", cursor: "pointer" }}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Delete Order</h3>
            <p>Are you sure you want to delete this order? This cannot be undone.</p>

            <div style={{ marginTop: 15, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button className="btn secondary" onClick={() => setDeleteId(null)} disabled={deleting}>Cancel</button>
              <button className="btn" onClick={deleteOrder} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
