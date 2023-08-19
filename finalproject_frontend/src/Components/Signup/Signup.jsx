import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import "./Signup";
import Navbar from '../Navbar/Navbar';

const RegistrationForm = ({ setIsRegistered }) => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    username: Yup.string().required("Username is required"),
    is_active: Yup.boolean().required("Active status is required"),
    is_staff: Yup.boolean().required("Staff status is required"),
    is_admin: Yup.boolean().required("Admin status is required"),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        alert("Registered successfully");
        setIsRegistered(true);
        navigate("/login");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "An error occurred.");
      }
    } catch (error) {
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <h2>Registration</h2>
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            username: "",
            is_active: false,
            is_staff: false,
            is_admin: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div>
              <label htmlFor="name">Name</label>
              <Field type="text" id="name" name="name" />
              <ErrorMessage name="name" component="div" />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <Field type="email" id="email" name="email" />
              <ErrorMessage name="email" component="div" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <Field type="password" id="password" name="password" />
              <ErrorMessage name="password" component="div" />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Field
                type="password"
                id="confirmPassword"
                name="confirmPassword"
              />
              <ErrorMessage name="confirmPassword" component="div" />
            </div>
            <div>
              <label htmlFor="username">Username</label>
              <Field type="text" id="username" name="username" />
              <ErrorMessage name="username" component="div" />
            </div>
            <div>
              <label htmlFor="is_active">Active</label>
              <Field type="checkbox" id="is_active" name="is_active" />
              <ErrorMessage name="is_active" component="div" />
            </div>
            <div>
              <label htmlFor="is_staff">Staff</label>
              <Field type="checkbox" id="is_staff" name="is_staff" />
              <ErrorMessage name="is_staff" component="div" />
            </div>
            <div>
              <label htmlFor="is_admin">Admin</label>
              <Field type="checkbox" id="is_admin" name="is_admin" />
              <ErrorMessage name="is_admin" component="div" />
            </div>
            <button type="submit">Register</button>
          </Form>
        </Formik>
        <p>
          Already registered?{" "}
          <button onClick={() => setIsRegistered(true)}>Log in here</button>
        </p>
      </div>
    </>
  );
};

export default RegistrationForm;
