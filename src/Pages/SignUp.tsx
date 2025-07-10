import React, { useState, useEffect } from "react";
import './SignUp.css';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const SignUp: React.FC = () => {
  const [companyName, setCompanyName] = useState("");
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleVerify = () => {
    if (companyName.trim()) {
      setSubmitted(true);
    }
  };

  useEffect(() => {
    if (!submitted) return;

    const apiUrl = "https://aihr4u.onrender.com/api/verify-company/";

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_name: companyName.trim() }),
    })
      .then(async (res) => {
        const data = await res.json();
        console.log("Response Status:", res.status);
        console.log("Response Body:", JSON.stringify(data, null, 2));

        if (res.ok && data.message?.includes("Verified")) {
          setIsVerified(true);
          setTimeout(() => navigate("/login"), 1500);
        } else {
          setIsVerified(false);
        }
      })
      .catch((error) => {
        console.error("Error verifying company:", error);
        setIsVerified(false);
      })
      .finally(() => {
        setSubmitted(false);
      });
  }, [submitted, companyName, navigate]);

  return (
    <div className="company-Page">
      <div className="company-box">
        <label>Enter Your Company</label><br />
        <div className="input-container">
          <span className="search-icon"><Search size={18} color="black" /></span>
          <input
            type="text"
            placeholder="Enter company name..."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <button onClick={handleVerify}>Verify</button>
        {isVerified === true && <p className="verified">✅ Verified! Redirecting to login...</p>}
        {isVerified === false && <p className="not-verified">❌ Company not verified</p>}
      </div>
    </div>
  );
};

export default SignUp;
