import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";
import styles from "./Login.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const form = new URLSearchParams();
      form.append("username", email);
      form.append("password", password);

      const response = await apiClient.post("/auth/login", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const { access_token } = response.data;
      login(access_token, { email });
      navigate("/bookings");
    } catch (err) {
      setError("Incorrect email or password");
    }
  }

  return (
    <div className={styles.loginPage}>
      <form onSubmit={handleSubmit} className={styles.loginCard}>
        <h2 className={styles.loginTitle}>AL-MAARIB Travels</h2>

        <div className={styles.loginField}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.loginField}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className={styles.loginError}>{error}</p>}

        <button type="submit" className={styles.loginButton}>
          Log in
        </button>
      </form>
    </div>
  );
}

export default Login;