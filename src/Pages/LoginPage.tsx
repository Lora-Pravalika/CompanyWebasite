import React, { useState, useEffect } from "react";
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loginStatus, setLoginStatus] = useState<"success" | "error" | null>(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (employeeId.trim() && password.trim()) {
      setSubmitted(true);
    }
  };

  useEffect(() => {
    if (!submitted) return;

    fetch("https://aihr4u.onrender.com/api/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee_id: employeeId.trim(),
        password: password.trim()
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        console.log("Login Response:", data);

        if (res.ok && data.message?.toLowerCase().includes("successful")) {
          setLoginStatus("success");
          setTimeout(() => navigate("/dashboard"), 1500); // ✅ Redirect
        } else {
          setLoginStatus("error");
        }
      })
      .catch(() => setLoginStatus("error"))
      .finally(() => setSubmitted(false));
  }, [submitted, employeeId, password, navigate]);

  return (
    <div className="login_page">
      <div className="login_box">
        <h2>Please Login</h2>
        <label>Employee ID</label>
        <input
          type="text"
          value={employeeId}
          required
          onChange={(e) => setEmployeeId(e.target.value)}
        /><br />
        <label className="pass">Password</label>
        <input
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button onClick={handleLogin}>Login</button>

        {loginStatus === "success" && <p className="login-success">✅ Login successful! Redirecting...</p>}
        {loginStatus === "error" && <p className="login-fail">❌ Invalid credentials</p>}
      </div>
    </div>
  );
};

export default LoginPage;
