import "./Login.css";
import { Formik, ErrorMessage, Field, Form } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/esm/Button";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    password: "",
  };

  const submitForm = async (values) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/project/signin/", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log(data);
      if (data?.access) {
        localStorage.setItem("access", data.access);
        navigate("/invoices");
      } else {
        alert("Login Credentials are not matching..!");
      }
    } catch (error) {
      console.error("Login unsuccesfull...!", error);
    }
  };
  const LoginSchema = Yup.object().shape({
    username: Yup.string().required("username is required"),
    password: Yup.string().required("Password is required"),
    // .min(6, "Password is too short - should be 6 chars minimum"),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={LoginSchema}
      onSubmit={submitForm}
    >
      {(formik) => {
        const { errors, touched } = formik;
        return (
          <>
            <Navbar />
            <div className="logincontainer">
              <Form className="loginform">
                <p className="loginheading">Login</p>
                <hr />
                <div className="loginbody">
                  <div className="form-row">
                    <Field
                      type="username"
                      name="username"
                      id="username"
                      placeholder="Enter username"
                      className={`inputfield ${
                        errors.username && touched.username
                          ? "input-error"
                          : null
                      }`}
                    />
                    <ErrorMessage
                      name="username"
                      className="errormsg"
                      component="div"
                    />
                  </div>

                  <div className="form-row">
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Enter password"
                      className={`inputfield ${
                        errors.password && touched.password
                          ? "input-error"
                          : null
                      }`}
                    />
                    <ErrorMessage
                      component="div"
                      className="errormsg"
                      name="password"
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

                  <Button type="submit" className="loginsubmit">
                    Login
                  </Button>
                </div>
              </Form>
            </div>
          </>
        );
      }}
    </Formik>
  );
}

export default Login;
