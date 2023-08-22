import React, { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleReset = async () => {
    try {
      const response = await fetch("http://your-api-url/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetSent(true);
      } else {
        console.error("Error sending password reset email: ", data.error);
      }
    } catch (error) {
      console.error("Error sending password reset email: ", error);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <div className="reset-body">
        {resetSent ? (
          <p>An email with password reset instructions has been sent to your inbox.</p>
        ) : (
          <>
            <p>Enter your email address to receive a password reset link:</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <button onClick={handleReset}>Send Reset Link</button>
          </>
        )}
        <p>
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
