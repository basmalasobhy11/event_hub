import { useState } from "react";
import { api } from "./api";
import "./styles/Register.css";


export default function Login({ onRegister, onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const result = await api.login(email, password);

      /*
       * Login returns the JWT token.
       * Keep it for later authenticated requests.
       */
      localStorage.setItem("token", result.token);

      /*
       * We already have the user's email.
       * The registration response contains the user ID if the same
       * browser is being used.
       */
     const oldUser = JSON.parse(localStorage.getItem("user") || "null");

      const tokenPayload = JSON.parse(atob(result.token.split(".")[1]));
      console.log("TOKEN PAYLOAD:", tokenPayload);
      const user = {
        ...(oldUser || {}),
        id: tokenPayload.sub,
        email: tokenPayload.email,
      };
      console.log("USER:", user);

localStorage.setItem("user", JSON.stringify(user));
      onLoggedIn(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>EventHub</h1>
        <h2>Welcome Back</h2>

        <p className="auth-subtitle">
          Login to continue.
        </p>

        <form onSubmit={handleLogin}>
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="switch-auth">
          Don't have an account?
          <button onClick={onRegister}>Register</button>
        </p>
      </div>
    </div>
  );
}