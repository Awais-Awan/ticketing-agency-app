import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/client";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import SearchInput from "../components/SearchInput";
import styles from "./BookingsList.module.css";

function BookingsList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiClient.get("/bookings").then((res) => {
      setBookings(res.data);
      setLoading(false);
    });
  }, []);

  function formatMoney(value) {
    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  const query = search.trim().toLowerCase();
  const filtered = bookings.filter((b) =>
    b.pnr_no.toLowerCase().includes(query) ||
    b.customer_name.toLowerCase().includes(query) ||
    b.supplier_name.toLowerCase().includes(query)
  );

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.pageTitle}>Bookings</h2>
        <Link to="/bookings/new" className={styles.newButton}>New booking</Link>
      </div>

      {!loading && bookings.length > 0 && (
        <SearchInput value={search} onChange={setSearch} placeholder="Search by PNR, customer, or supplier" />
      )}

      {loading ? (
        <Spinner />
      ) : bookings.length === 0 ? (
        <EmptyState message="No bookings yet. Create the first one to get started." />
      ) : filtered.length === 0 ? (
        <EmptyState message="No bookings match your search." />
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>PNR</th>
                <th>Customer</th>
                <th>Supplier</th>
                <th>Sector</th>
                <th>Date of travel</th>
                <th>Booked on</th>
                <th className={styles.numCol}>Sale amount</th>
                <th className={styles.numCol}>Payable to supplier</th>
                <th className={styles.numCol}>Pending</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className={styles.row}>
                  <td>
                    <Link to={`/bookings/${b.id}`} className={styles.link}>{b.pnr_no}</Link>
                  </td>
                  <td>{b.customer_name}</td>
                  <td>{b.supplier_name}</td>
                  <td>{b.sector}</td>
                  <td>{b.date_of_travel}</td>
                  <td>{b.created_at.slice(0, 10)}</td>
                  <td className={styles.numCol}>{formatMoney(b.sale_amount)}</td>
                  <td className={styles.numCol}>{formatMoney(b.cost_price)}</td>
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
        </div>
      )}
    </div>
  );
}

export default BookingsList;