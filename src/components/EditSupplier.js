import React, { useEffect, useState } from "react";
import { API_BASE } from "../api";
import { useNavigate, useParams } from "react-router-dom";

export default function EditSupplier() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    address: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch supplier data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/suppliers/${id}`);
        const data = await res.json();

        setForm({
          name: data.name || "",
          contact: data.contact || "",
          email: data.email || "",
          address: data.address || ""
        });
      } catch (err) {
        console.error("Failed to fetch supplier", err);
        setError("Failed to load supplier data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) return "Invalid email format.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);

    setSaving(true);
    try {
      await fetch(`${API_BASE}/suppliers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      navigate("/suppliers");
    } catch (err) {
      console.error("Error updating supplier", err);
      setError("Failed to update supplier.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="card">
        <h2>Loading...</h2>
      </section>
    );
  }

  return (
    <section className="card" style={{ maxWidth: 760, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>Edit Supplier</h2>
          <div className="muted" style={{ marginTop: 6 }}>Update supplier details</div>
        </div>

        <button className="btn secondary" onClick={() => navigate("/suppliers")} disabled={saving}>
          Cancel
        </button>
      </div>

      <form className="form" onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <label>
          Name *
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Supplier name"
          />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>
            Contact
            <input
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="Phone number"
            />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@example.com"
            />
          </label>
        </div>

        <label>
          Address
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Complete address"
          />
        </label>

        {error && (
          <div className="error" style={{ marginTop: 6 }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <button className="btn" type="submit" disabled={saving}>
            {saving ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
