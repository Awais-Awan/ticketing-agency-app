import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/client";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import styles from "./CustomersList.module.css";

function CustomersList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/customers").then((res) => {
      setCustomers(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h2 className={styles.pageTitle}>Customers</h2>

      {loading ? (
        <Spinner />
      ) : customers.length === 0 ? (
        <EmptyState message="No customers yet." />
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className={styles.row}>
                <td>
                  <Link to={`/customers/${c.id}`} className={styles.link}>{c.name}</Link>
                </td>
                <td>{c.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CustomersList;