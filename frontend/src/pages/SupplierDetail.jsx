import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiClient from "../api/client";
import styles from "./SupplierDetail.module.css";

function formatMoney(value) {
  return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function SupplierDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    loadSupplier();
  }, [id]);

  async function loadSupplier() {
    setLoading(true);
    const response = await apiClient.get(`/suppliers/${id}`);
    setSupplier(response.data);
    setLoading(false);
  }

  async function handleAddPayment(e) {
    e.preventDefault();
    setError("");
    try {
      await apiClient.post(`/suppliers/${id}/payments`, {
        amount: parseFloat(paymentAmount),
        payment_date: paymentDate,
      });
      setPaymentAmount("");
      loadSupplier();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not add payment");
    }
  }

  if (loading) return <p>Loading...</p>;
  if (!supplier) return <p>Supplier not found</p>;

  return (
    <div>
      <button onClick={() => navigate(-1)} className={styles.backLink}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Back to suppliers</span>
      </button>

      <h2 className={styles.pageTitle}>{supplier.name}</h2>
      <p className={styles.contact}>{supplier.email} · {supplier.phone}</p>

      <div className={styles.summaryCard}>
        <span className={styles.summaryLabel}>Balance owed</span>
        <span className={supplier.balance_owed > 0 ? styles.negative : styles.positive}>
          {formatMoney(supplier.balance_owed)}
        </span>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.columns}>
        <div>
          <h3 className={styles.sectionLabel}>Bookings (tickets bought)</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>PNR</th>
                <th className={styles.numCol}>Cost price</th>
              </tr>
            </thead>
            <tbody>
              {supplier.bookings.length === 0 ? (
                <tr><td colSpan={2} className={styles.empty}>No bookings yet</td></tr>
              ) : (
                supplier.bookings.map((b) => (
                  <tr key={b.id}>
                    <td><Link to={`/bookings/${b.id}`} className={styles.link}>{b.pnr_no}</Link></td>
                    <td className={styles.numCol}>{formatMoney(b.cost_price)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div>
          <h3 className={styles.sectionLabel}>Payments made</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th className={styles.numCol}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {supplier.payments.length === 0 ? (
                <tr><td colSpan={2} className={styles.empty}>No payments yet</td></tr>
              ) : (
                supplier.payments.map((p) => (
                  <tr key={p.id}>
                    <td>{p.payment_date}</td>
                    <td className={styles.numCol}>{formatMoney(p.amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <form onSubmit={handleAddPayment} className={styles.paymentForm}>
            <input
              type="number"
              placeholder="Amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              required
            />
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
            />
            <button type="submit" className={styles.primaryButton}>Record settlement</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SupplierDetail;