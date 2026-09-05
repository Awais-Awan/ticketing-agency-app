import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/client";
import styles from "./BookingsList.module.css";

function BookingsList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/bookings").then((res) => {
      setBookings(res.data);
      setLoading(false);
    });
  }, []);

  function formatMoney(value) {
    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.pageTitle}>Bookings</h2>
        <Link to="/bookings/new" className={styles.newButton}>New booking</Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p className={styles.empty}>No bookings yet. Create the first one to get started.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>PNR</th>
              <th>Customer</th>
              <th>Sector</th>
              <th>Date of travel</th>
              <th className={styles.numCol}>Sale amount</th>
              <th className={styles.numCol}>Pending</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>
                  <Link to={`/bookings/${b.id}`} className={styles.link}>{b.pnr_no}</Link>
                </td>
                <td>{b.customer_name}</td>
                <td>{b.sector}</td>
                <td>{b.date_of_travel}</td>
                <td className={styles.numCol}>{formatMoney(b.sale_amount)}</td>
                <td className={styles.numCol}>{formatMoney(b.pending_amount)}</td>
                <td>
                  <span className={b.status === "cancelled" ? styles.statusCancelled : styles.statusActive}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BookingsList;