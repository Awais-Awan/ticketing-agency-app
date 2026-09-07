import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/client";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import SearchInput from "../components/SearchInput";
import styles from "./CustomersList.module.css";

function CustomersList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiClient.get("/customers").then((res) => {
      setCustomers(res.data);
      setLoading(false);
    });
  }, []);

  const query = search.trim().toLowerCase();
  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(query) ||
    c.phone.toLowerCase().includes(query)
  );

  return (
    <div>
      <h2 className={styles.pageTitle}>Customers</h2>

      {!loading && customers.length > 0 && (
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or phone" />
      )}

      {loading ? (
        <Spinner />
      ) : customers.length === 0 ? (
        <EmptyState message="No customers yet." />
      ) : filtered.length === 0 ? (
        <EmptyState message="No customers match your search." />
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
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