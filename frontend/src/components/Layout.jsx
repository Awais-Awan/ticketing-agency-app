import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Layout.module.css";

function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>AL-MAARIB Travels</div>
        <nav className={styles.nav}>
          <NavLink to="/bookings/" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}>
            Bookings
          </NavLink>
          <NavLink to="/suppliers" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}>
            Suppliers
          </NavLink>
          <NavLink to="/customers" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}>
            Customers
          </NavLink>
        </nav>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <span className={styles.userEmail}>{user?.email}</span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Log out
          </button>
        </header>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}

export default Layout;