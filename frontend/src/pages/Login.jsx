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
      navigate("/dashboard");
    } catch (err) {
      setError("Incorrect email or password");
    }
  }

  return (
    <div className={styles.loginPage}>
    <svg className={styles.bgIllustration} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>

      {[[70,60],[140,220],[230,90],[310,340],[90,400],[420,80],[500,500],[650,60],[720,300],[380,470],[180,150],[610,420]].map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2 : 1.2} fill="#F7F8FA" fillOpacity="0.25" />
      ))}

      <circle cx="580" cy="220" r="180" fill="#3A5680" fillOpacity="0.35" filter="url(#glow)" />

      <circle cx="580" cy="220" r="200" fill="none" stroke="#F7F8FA" strokeOpacity="0.14" strokeWidth="1.5" />
      <ellipse cx="580" cy="220" rx="200" ry="70" fill="none" stroke="#F7F8FA" strokeOpacity="0.12" strokeWidth="1.2" />
      <ellipse cx="580" cy="220" rx="200" ry="130" fill="none" stroke="#F7F8FA" strokeOpacity="0.12" strokeWidth="1.2" />
      <ellipse cx="580" cy="220" rx="200" ry="180" fill="none" stroke="#F7F8FA" strokeOpacity="0.1" strokeWidth="1.2" />
      <line x1="380" y1="220" x2="780" y2="220" stroke="#F7F8FA" strokeOpacity="0.14" strokeWidth="1.2" />
      <path d="M580 20 Q 700 220 580 420" fill="none" stroke="#F7F8FA" strokeOpacity="0.1" strokeWidth="1.2" />

      {/* Flight path 1 */}
      <path d="M40 500 Q 300 340 540 410" fill="none" stroke="#F7F8FA" strokeOpacity="0.22" strokeWidth="1.5" strokeDasharray="6 6" />
      <circle cx="40" cy="500" r="4" fill="#1E8E5A" />
      <g transform="translate(540,410) rotate(16) scale(0.6)">
        <path d="M14 0 L3 -2 L-6 -11 L-2 -3 L-9 -2 L-14 -5 L-11 -2 L-14 0 L-11 2 L-14 5 L-9 2 L-2 3 L-6 11 L3 2 Z" fill="#F7F8FA" fillOpacity="0.55" />
      </g>

      {/* Flight path 2 */}
      <path d="M90 80 Q 320 40 500 200" fill="none" stroke="#F7F8FA" strokeOpacity="0.18" strokeWidth="1.5" strokeDasharray="6 6" />
      <circle cx="90" cy="80" r="4" fill="#B54708" />
      <g transform="translate(500,200) rotate(42) scale(0.6)">
        <path d="M14 0 L3 -2 L-6 -11 L-2 -3 L-9 -2 L-14 -5 L-11 -2 L-14 0 L-11 2 L-14 5 L-9 2 L-2 3 L-6 11 L3 2 Z" fill="#F7F8FA" fillOpacity="0.5" />
      </g>

      {/* Flight path 3 */}
      <path d="M20 250 Q 220 180 380 260" fill="none" stroke="#F7F8FA" strokeOpacity="0.14" strokeWidth="1.2" strokeDasharray="5 7" />
      <circle cx="20" cy="250" r="3" fill="#F7F8FA" fillOpacity="0.4" />
      <g transform="translate(380,260) rotate(27) scale(0.45)">
        <path d="M14 0 L3 -2 L-6 -11 L-2 -3 L-9 -2 L-14 -5 L-11 -2 L-14 0 L-11 2 L-14 5 L-9 2 L-2 3 L-6 11 L3 2 Z" fill="#F7F8FA" fillOpacity="0.4" />
      </g>

      {/* Flight path 4: bottom-right corner */}
      <path d="M620 560 Q 700 480 770 520" fill="none" stroke="#F7F8FA" strokeOpacity="0.18" strokeWidth="1.5" strokeDasharray="6 6" />
      <circle cx="620" cy="560" r="4" fill="#1E8E5A" />
      <g transform="translate(770,520) rotate(30) scale(0.5)">
        <path d="M14 0 L3 -2 L-6 -11 L-2 -3 L-9 -2 L-14 -5 L-11 -2 L-14 0 L-11 2 L-14 5 L-9 2 L-2 3 L-6 11 L3 2 Z" fill="#F7F8FA" fillOpacity="0.5" />
      </g>

      {/* Flight path 5: upper-left corner, opposite direction for variety */}
      <path d="M250 30 Q 150 120 60 200" fill="none" stroke="#F7F8FA" strokeOpacity="0.14" strokeWidth="1.2" strokeDasharray="5 7" />
      <circle cx="250" cy="30" r="3" fill="#F7F8FA" fillOpacity="0.4" />
      <g transform="translate(60,200) rotate(138) scale(0.45)">
        <path d="M14 0 L3 -2 L-6 -11 L-2 -3 L-9 -2 L-14 -5 L-11 -2 L-14 0 L-11 2 L-14 5 L-9 2 L-2 3 L-6 11 L3 2 Z" fill="#F7F8FA" fillOpacity="0.4" />
      </g>
    </svg>

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