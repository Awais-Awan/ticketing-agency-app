import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/client";
import styles from "./Dashboard.module.css";

function formatMoney(value) {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get("/bookings"),
      apiClient.get("/suppliers"),
    ]).then(([bookingsRes, suppliersRes]) => {
      setBookings(bookingsRes.data);
      setSuppliers(suppliersRes.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading...</p>;

  const activeBookings = bookings.filter((b) => b.status !== "cancelled");
  const totalSales = activeBookings.reduce((sum, b) => sum + parseFloat(b.sale_amount), 0);
  const totalProfit = activeBookings.reduce((sum, b) => sum + parseFloat(b.profit), 0);
  const totalReceivable = activeBookings.reduce((sum, b) => sum + Math.max(parseFloat(b.pending_amount), 0), 0);
  const totalPayable = suppliers.reduce((sum, s) => sum + Math.max(parseFloat(s.balance_owed), 0), 0);

  const pendingBookings = activeBookings
    .filter((b) => parseFloat(b.pending_amount) > 0)
    .sort((a, b) => parseFloat(b.pending_amount) - parseFloat(a.pending_amount))
    .slice(0, 8);

  const suppliersOwed = suppliers
    .filter((s) => parseFloat(s.balance_owed) > 0)
    .sort((a, b) => parseFloat(b.balance_owed) - parseFloat(a.balance_owed))
    .slice(0, 8);

  return (
    <div>
      <h2 className={styles.pageTitle}>Dashboard</h2>

      <div className={styles.metrics}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Total sales</span>
          <span className={styles.metricValue}>{formatMoney(totalSales)}</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Total profit</span>
          <span className={`${styles.metricValue} ${totalProfit < 0 ? styles.negative : styles.positive}`}>
            {formatMoney(totalProfit)}
          </span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Receivable (customers owe)</span>
          <span className={styles.metricValue}>{formatMoney(totalReceivable)}</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Payable (owed to suppliers)</span>
          <span className={styles.metricValue}>{formatMoney(totalPayable)}</span>
        </div>
      </div>

      <div className={styles.columns}>
        <div>
          <h3 className={styles.sectionLabel}>Pending payments</h3>
          {pendingBookings.length === 0 ? (
            <p className={styles.empty}>Nothing pending.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>PNR</th>
                  <th>Customer</th>
                  <th className={styles.numCol}>Pending</th>
                </tr>
              </thead>
              <tbody>
                {pendingBookings.map((b) => (
                  <tr key={b.id}>
                    <td><Link to={`/bookings/${b.id}`} className={styles.link}>{b.pnr_no}</Link></td>
                    <td>{b.customer_name}</td>
                    <td className={styles.numCol}>{formatMoney(parseFloat(b.pending_amount))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div>
          <h3 className={styles.sectionLabel}>Supplier dues</h3>
          {suppliersOwed.length === 0 ? (
            <p className={styles.empty}>Nothing owed.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th className={styles.numCol}>Balance owed</th>
                </tr>
              </thead>
              <tbody>
                {suppliersOwed.map((s) => (
                  <tr key={s.id}>
                    <td><Link to={`/suppliers/${s.id}`} className={styles.link}>{s.name}</Link></td>
                    <td className={styles.numCol}>{formatMoney(parseFloat(s.balance_owed))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;