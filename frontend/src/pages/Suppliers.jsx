import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/client";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import styles from "./Suppliers.module.css";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function loadSuppliers() {
    setLoading(true);
    const response = await apiClient.get("/suppliers");
    setSuppliers(response.data);
    setLoading(false);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    try {
      await apiClient.post("/suppliers", form);
      setForm({ name: "", email: "", phone: "", address: "" });
      loadSuppliers();
    } catch (err) {
      setFormError(err.response?.data?.detail || "Could not create supplier");
    }
  }

  return (
    <div>
      <h2 className={styles.pageTitle}>Suppliers</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <button type="submit" className={styles.addButton}>Add supplier</button>
      </form>

      {formError && <p className={styles.formError}>{formError}</p>}

      {loading ? (
        <Spinner />
      ) : suppliers.length === 0 ? (
        <EmptyState message="No suppliers yet. Add one above to get started." />
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th className={styles.numCol}>Balance owed</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id} className={styles.row}>
                <td><Link to={`/suppliers/${s.id}`} className={styles.link}>{s.name}</Link></td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td>{s.address}</td>
                <td className={styles.numCol}>{s.balance_owed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Suppliers;