import React, { useState } from "react";
import { API_BASE } from "../api";
import { useNavigate } from "react-router-dom";

export default function AddSupplier() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    address: ""
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) return "Email is invalid.";
    if (form.contact && !/^[0-9+\-() ]{6,20}$/.test(form.contact)) return "Contact looks invalid.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) { setError(v); return; }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/suppliers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        throw new Error(txt || `Status ${res.status}`);
      }

      navigate("/suppliers");
    } catch (err) {
      console.error("Error adding supplier", err);
      setError("Failed to save supplier. See console.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="card" style={{ maxWidth: 760, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>Add Supplier</h2>
          <div className="muted" style={{ marginTop: 6 }}>Create a new supplier record</div>
        </div>
      </div>

      <form className="form" onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <label>
          Name <span style={{ color: "var(--danger)", marginLeft: 6 }}>*</span>
          <input
            name="name"
            placeholder="Supplier name (e.g., ABC Distributors)"
            required
            value={form.name}
            onChange={handleChange}
            autoFocus
          />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>
            Contact
            <input
              name="contact"
              placeholder="0917-xxxxxxx or +63-917-xxx"
              value={form.contact}
              onChange={handleChange}
            />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              placeholder="supplier@email.com"
              value={form.email}
              onChange={handleChange}
            />
          </label>
        </div>

        <label>
          Address
          <input
            name="address"
            placeholder="Street, City, Province"
            value={form.address}
            onChange={handleChange}
          />
        </label>

        {error && <div className="error" style={{ marginTop: 6 }}>{error}</div>}

        <div className="form-actions" style={{ marginTop: 12 }}>
          <button className="btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Supplier"}
          </button>

          <button
            type="button"
            className="btn secondary"
            onClick={() => navigate("/suppliers")}
            disabled={saving}
            style={{ marginLeft: 8 }}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
