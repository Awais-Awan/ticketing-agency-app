import { useState, useEffect } from "react";
import apiClient from "../api/client";
import styles from "./BookingForm.module.css";

const emptyForm = {
  customer_name: "",
  phone_number: "",
  pnr_no: "",
  date_of_travel: "",
  sector: "",
  reference: "",
  supplier_id: "",
  cost_price: "",
  sale_amount: "",
  received_payment: "",
  paid_to_supplier: "",
};

function BookingForm() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    apiClient.get("/suppliers").then((res) => setSuppliers(res.data));
  }, []);

  const costPrice = parseFloat(form.cost_price) || 0;
  const saleAmount = parseFloat(form.sale_amount) || 0;
  const receivedPayment = parseFloat(form.received_payment) || 0;
  const hasBothAmounts = form.cost_price !== "" && form.sale_amount !== "";
  const profit = saleAmount - costPrice;
  const pending = saleAmount - receivedPayment;

  function formatMoney(value) {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      customer_name: form.customer_name,
      phone_number: form.phone_number,
      pnr_no: form.pnr_no,
      date_of_travel: form.date_of_travel || null,
      sector: form.sector || null,
      reference: form.reference || null,
      supplier_id: parseInt(form.supplier_id, 10),
      cost_price: costPrice,
      sale_amount: saleAmount,
    };
    if (form.received_payment) payload.received_payment = receivedPayment;
    if (form.paid_to_supplier) payload.paid_to_supplier = parseFloat(form.paid_to_supplier);

    try {
      const response = await apiClient.post("/bookings", payload);
      setSuccess(`Booking created (PNR ${response.data.pnr_no})`);
      setForm(emptyForm);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not create booking");
    }
  }

  return (
    <div>
      <h2 className={styles.pageTitle}>New booking</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <h3 className={styles.sectionLabel}>Customer</h3>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Customer name</label>
            <input name="customer_name" value={form.customer_name} onChange={handleChange} required />
          </div>
          <div className={styles.field}>
            <label>Phone number</label>
            <input name="phone_number" value={form.phone_number} onChange={handleChange} required />
          </div>
        </div>

        <h3 className={styles.sectionLabel}>Travel details</h3>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>PNR no.</label>
            <input name="pnr_no" value={form.pnr_no} onChange={handleChange} required />
          </div>
          <div className={styles.field}>
            <label>Date of travel</label>
            <input type="date" name="date_of_travel" value={form.date_of_travel} onChange={handleChange} />
          </div>
          <div className={styles.field}>
            <label>Sector</label>
            <input name="sector" placeholder="ISB-DXB-ISB" value={form.sector} onChange={handleChange} />
          </div>
          <div className={styles.field}>
            <label>Reference</label>
            <input name="reference" value={form.reference} onChange={handleChange} />
          </div>
        </div>

        <h3 className={styles.sectionLabel}>Supplier and cost</h3>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Supplier</label>
            <select name="supplier_id" value={form.supplier_id} onChange={handleChange} required>
              <option value="">Select a supplier</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label>Ticket purchase price</label>
            <input type="number" name="cost_price" value={form.cost_price} onChange={handleChange} required />
          </div>
          <div className={styles.field}>
            <label>Paid to supplier</label>
            <input type="number" name="paid_to_supplier" value={form.paid_to_supplier} onChange={handleChange} />
          </div>
        </div>

        <h3 className={styles.sectionLabel}>Payment</h3>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Payment (sale amount)</label>
            <input type="number" name="sale_amount" value={form.sale_amount} onChange={handleChange} required />
          </div>
          <div className={styles.field}>
            <label>Received payment</label>
            <input type="number" name="received_payment" value={form.received_payment} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.preview}>
          <div>
            <span className={styles.previewLabel}>Profit</span>
            <span className={`${styles.previewValue} ${hasBothAmounts && profit < 0 ? styles.negative : styles.positive}`}>
              {hasBothAmounts ? formatMoney(profit) : "—"}
            </span>
          </div>
          <div>
            <span className={styles.previewLabel}>Pending amount</span>
            <span className={styles.previewValue}>{formatMoney(pending)}</span>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <button type="submit" className={styles.submitButton}>Create booking</button>
      </form>
    </div>
  );
}

export default BookingForm;