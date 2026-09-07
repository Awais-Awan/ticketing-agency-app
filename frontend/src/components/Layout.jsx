import { NavLink, useNavigate, useLocation, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Layout.module.css";

function Layout() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" />;
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
<div className={styles.brand} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', height: '32px' }}>
  <span className={styles.brandName}>AL-MAARIB Travels</span>
  
  {/* Canvas height bumped to 72px to hold the ultra-wide, tall loop safely without clipping */}
  <svg width="210" height="72" viewBox="0 0 210 72" className={styles.brandPath} style={{ position: 'absolute', top: '5px', left: 0, width: '210px', height: '72px', pointerEvents: 'none' }}>
    {/* Massive loop path: stretches much wider (X coordinates 50 to 95) and deeper (Y=58) */}
    <path 
      d="M 5,58 C 30,58 45,58 55,44 C 82,24 95,2 70,2 C 45,2 50,58 90,58 C 130,58 155,44 200,44" 
      fill="none" 
      stroke="#F7F8FA" 
      strokeOpacity="0.40" 
      strokeWidth="2.5" 
      strokeDasharray="5 5" 
    />
    
    {/* Plane resting at the exit point of the massive loop line (Y=44) */}
    <g transform="translate(200,44) rotate(-2) scale(0.7)">
      <path 
        d="M14 0 L3 -2 L-6 -11 L-2 -3 L-9 -2 L-14 -5 L-11 -2 L-14 0 L-11 2 L-14 5 L-9 2 L-2 3 L-6 11 L3 2 Z" 
        fill="#F7F8FA" 
        fillOpacity="0.8" 
      />
    </g>
  </svg>
</div>

        <nav className={styles.nav}>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
            Dashboard
          </NavLink>
          <NavLink to="/bookings" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"></path></svg>
            Bookings
          </NavLink>
          <NavLink to="/suppliers" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21V8l9-5 9 5v13"></path><path d="M9 21V12h6v9"></path></svg>
            Suppliers
          </NavLink>
          <NavLink to="/customers" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"></circle><path d="M4 21c0-4 4-6 8-6s8 2 8 6"></path></svg>
            Customers
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            Reports
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
        <div key={location.pathname} className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;