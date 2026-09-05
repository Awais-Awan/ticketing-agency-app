import { useState, useEffect } from "react";
import apiClient from "../api/client";
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
        <p>Loading...</p>
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
              <tr key={s.id}>
                <td>{s.name}</td>
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