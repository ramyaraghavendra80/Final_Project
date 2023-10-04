// Login.js
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
function Login({ onLogin }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/project/signin/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        const accessToken = data.access_token;
        const username = data.username;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("username", username);

        // Trigger the parent component's login function
        onLogin();
        navigate("/");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {error && <div className="error">{error}</div>}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="loginform">
          <div className="loginheading">
            <p>Login</p>
          </div>
          <hr />
          <div className="loginbody">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Field
                className="inputfield"
                type="text"
                id="username"
                name="username"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="errormsg"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field
                className="inputfield"
                type="password"
                id="password"
                name="password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="errormsg"
              />
            </div>
            <div>
              <p className="text">
                Don't have an account?
                <span>
                  <Link to="/signup" className="signuplink">
                    Signup here
                  </Link>
                </span>
              </p>
            </div>
            <button className="loginsubmit" type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default Login;
