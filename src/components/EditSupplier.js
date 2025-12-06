// src/components/EditSupplier.jsx
import React, { useEffect, useState } from "react";
import { API_BASE } from "../api";
import { useNavigate, useParams } from "react-router-dom";

export default function EditSupplier() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", contact: "" });
  const [original, setOriginal] = useState({ name: "", contact: "" }); // ⭐ store original data

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch supplier data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/suppliers/${id}`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();

        const loaded = {
          name: data?.name ?? "",
          contact: data?.contact ?? ""
        };

        setForm(loaded);
        setOriginal(loaded); // ⭐ save the original values
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

  // Validate fields
  const validate = () => {
    if (!form.name.trim()) return "Name is required.";

    const contact = (form.contact ?? "").trim();
    if (!contact) return "Contact is required.";

    const isPhone = /^[0-9+\-() ]{6,20}$/.test(contact);
    const isGmail = /^[A-Za-z0-9._%+-]+@gmail\.com$/i.test(contact);

    if (!isPhone && !isGmail) {
      return "Contact must be a valid phone number or a Gmail address.";
    }

    return "";
  };

  // ⭐ Check if something changed
  const isUnchanged =
    form.name.trim() === original.name.trim() &&
    form.contact.trim() === original.contact.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ⭐ Block saving if no changes
    if (isUnchanged) {
      setError("No changes detected.");
      return;
    }

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setSaving(true);
    try {
      const payload = { name: form.name.trim(), contact: form.contact.trim() };

      const res = await fetch(`${API_BASE}/suppliers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`Status ${res.status}`);

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
            value={form.name}
            onChange={handleChange}
            placeholder="Supplier name"
            autoFocus
          />
        </label>

        <label style={{ marginTop: 12 }}>
          Contact *
          <input
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="Phone number or Gmail"
          />
        </label>

        {error && (
          <div className="error" style={{ marginTop: 8 }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <button
            className="btn"
            type="submit"
            disabled={saving || isUnchanged} // ⭐ disable button if unchanged
          >
            {saving ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
