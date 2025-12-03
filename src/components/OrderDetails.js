// src/components/OrderDetails.jsx
import React, { useEffect, useState } from "react";
import { API_BASE } from "../api";
import { useParams, Link } from "react-router-dom";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [prodMap, setProdMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        // fetch order
        const rOrder = await fetch(`${API_BASE}/orders/${id}`);
        if (!rOrder.ok) throw new Error("Failed to fetch order");
        const orderData = await rOrder.json();
        setOrder(orderData);

        // fetch all products once (used as fallback lookup)
        const rProducts = await fetch(`${API_BASE}/products`);
        if (!rProducts.ok) throw new Error("Failed to fetch products");
        const products = await rProducts.json();
        const map = {};
        (Array.isArray(products) ? products : []).forEach(p => {
          const pid = (p._id ?? p.id ?? "").toString();
          if (pid) map[pid] = p;
        });
        setProdMap(map);
      } catch (err) {
        console.error("OrderDetails load error:", err);
        setOrder(null);
        setProdMap({});
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <p>Loading order...</p>;
  if (!order) return <p>Order not found.</p>;

  const items = Array.isArray(order.items) ? order.items : [];

  // Helpers
  const nameFor = (it) => {
    // 1) explicit fields on item
    if (it.productName) return it.productName;
    if (it.name) return it.name;

    // 2) item.product (object) with name
    if (it.product && typeof it.product === "object" && it.product.name) return it.product.name;

    // 3) item.productId may be an object (with name) or an id string
    if (it.productId && typeof it.productId === "object") {
      if (it.productId.name) return it.productId.name;
      // fallback to nested product object inside productId (some APIs nest)
      if (it.productId.product && it.productId.product.name) return it.productId.product.name;
    }

    // 4) lookup by id using prodMap
    const pid = (it.productId && typeof it.productId !== "object") ? String(it.productId)
              : (it.product && it.product._id ? String(it.product._id) : null);

    if (pid && prodMap[pid]) return prodMap[pid].name || prodMap[pid].title || "Unnamed product";

    // 5) fallback
    const pidStr = (it.productId && typeof it.productId === "object") ? (it.productId._id ?? it.productId.id) : pid;
    return pidStr ? `Unknown product (${String(pidStr)})` : "Unknown product";
  };

  const qtyFor = (it) => Number(it.qty ?? it.quantity ?? 0);
  const priceFor = (it) => Number(it.price ?? it.unitPrice ?? it.amount ?? 0);
  const subtotalFor = (it) => qtyFor(it) * priceFor(it);
  const grandTotal = items.reduce((s, it) => s + subtotalFor(it), 0);

  return (
    <section className="card">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <h2 style={{margin:0}}>Order Details</h2>
        <div className="muted">
          Status: <strong style={{color: order.status === "pending" ? "var(--danger)" : "var(--accent)"}}>
            {order.status ?? "—"}
          </strong>
        </div>
      </div>

      <div style={{marginTop:12}}>
        <p><strong>Order ID:</strong> {order._id || order.id}</p>
        {order.orderNumber && <p><strong>Order #:</strong> {order.orderNumber}</p>}
        <p><strong>Supplier:</strong> {order.supplier?.name ?? order.supplier ?? "No supplier info"}</p>
        {order.customerName && <p><strong>Customer:</strong> {order.customerName}</p>}
        <p><strong>Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : "—"}</p>
      </div>

      <h3 style={{marginTop:12}}>Items</h3>

      {items.length === 0 ? (
        <div className="muted">No items in this order.</div>
      ) : (
        <div style={{display:"grid", gap:10, marginTop:8}}>
          {items.map((it, i) => (
            <div key={i} className="product-box" style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <div>
                <div style={{fontWeight:700}}>{nameFor(it)}</div>
                <div className="muted" style={{fontSize:13}}>
                  Product ID: {String(it.productId && typeof it.productId === "object" ? (it.productId._id ?? it.productId.id ?? it.productId) : (it.productId ?? it.product?._id ?? "—"))}
                </div>
              </div>

              <div style={{textAlign:"right"}}>
                <div>Qty: {qtyFor(it)}</div>
                <div>Unit: ₱{priceFor(it).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                <div style={{fontWeight:700, marginTop:6}}>Subtotal: ₱{subtotalFor(it).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:16}}>
        <div className="muted">Items: {items.length}</div>
        <div style={{fontSize:18, fontWeight:800}}>Grand Total: ₱{grandTotal.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
      </div>

      <div style={{marginTop:14}}>
        <Link to="/orders" className="btn secondary">Back to Orders</Link>
      </div>
    </section>
  );
}
