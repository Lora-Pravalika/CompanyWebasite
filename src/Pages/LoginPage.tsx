import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState<"success" | "error" | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!employeeId.trim() || !password.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("https://aihr4u.onrender.com/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: employeeId.trim(),
          password: password.trim()
        }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (res.ok && data.access_token) {
        localStorage.setItem("authToken", data.access_token);
        localStorage.setItem("refreshToken", data.refresh_token || "");
        localStorage.setItem("employee_id", data.employee_id);
        localStorage.setItem("name", data.name);

        setLoginStatus("success");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setLoginStatus("error");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setLoginStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login_page">
      <div className="login_box">
        <h2>Please Login</h2>
        <label>Employee ID</label>
        <input
          type="text"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
        />
        <label className="pass">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {loginStatus === "success" && <p className="login-success">✅ Login successful! Redirecting...</p>}
        {loginStatus === "error" && <p className="login-fail">❌ Invalid credentials</p>}
      </div>
    </div>
  );
};

export default LoginPage;
