import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiClient from "../api/client";
import styles from "./CustomerLedger.module.css";

function formatMoney(value) {
  return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function CustomerLedger() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get(`/customers/${id}`).then((res) => {
      setCustomer(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!customer) return <p>Customer not found</p>;

  return (
    <div>
      <button onClick={() => navigate("/customers")} className={styles.backLink}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Back to customers</span>
      </button>

      <h2 className={styles.pageTitle}>{customer.name}</h2>
      <p className={styles.phone}>{customer.phone}</p>

      <div className={styles.summaryCard}>
        <span className={styles.summaryLabel}>Total pending</span>
        <span className={customer.total_pending > 0 ? styles.negative : styles.positive}>
          {formatMoney(customer.total_pending)}
        </span>
      </div>

      <h3 className={styles.sectionLabel}>Bookings</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>PNR</th>
            <th className={styles.numCol}>Sale amount</th>
            <th className={styles.numCol}>Received</th>
            <th className={styles.numCol}>Pending</th>
          </tr>
        </thead>
        <tbody>
          {customer.bookings.map((b) => (
            <tr key={b.id}>
              <td>
                <Link to={`/bookings/${b.id}`} className={styles.link}>{b.pnr_no}</Link>
              </td>
              <td className={styles.numCol}>{formatMoney(b.sale_amount)}</td>
              <td className={styles.numCol}>{formatMoney(b.received_payment)}</td>
              <td className={styles.numCol}>{formatMoney(b.pending_amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerLedger;