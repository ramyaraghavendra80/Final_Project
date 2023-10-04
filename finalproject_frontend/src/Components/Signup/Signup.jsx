import Button from "react-bootstrap/Button";
import "./Signup.css";
import { useState } from "react";
import * as Yup from "yup";
import { Formik, ErrorMessage, Field, Form } from "formik";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

function Signup() {
  const navigate = useNavigate();
  const initialValues = {
    name: "",
    email: "",
    password: "",
    username: "",
  };
  const submitForm = (values, props) => {
    console.log(values);
    props.resetForm();
    console.log(props);
    fetch("http://127.0.0.1:8000/project/signup/", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 201) {
          navigate("/login");
        } else {
          alert("Signup unsuccesfull...!");
        }
      })
      .catch((error) => {
        console.error("Signup unsuccesfull...!", error);
      });
  };

  const SignUpSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Name is required"),
    email: Yup.string()
      .email("Email format is invalid")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password is too short - should be 6 chars minimum"),
    username: Yup.string().required("username is required"),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignUpSchema}
      onSubmit={submitForm}
    >
      {(formik) => {
        const { errors, touched } = formik;
        return (
          <div className="container">
            <div className="signupcontainer">
              <Form className="signupform">
                <p className="signupheading">SignUp</p>
                <hr />
                <div className="signupbody">
                  <div className="form-row">
                    <Field
                      type="Name"
                      name="name"
                      placeholder="Enter Name"
                      className={`inputfield ${
                        errors.name && touched.name ? "input-error" : null
                      }`}
                    />
                    <ErrorMessage
                      name="name"
                      className="errormsg"
                      component="div"
                    />
                  </div>
                  <div className="form-row">
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter email"
                      className={`inputfield ${
                        errors.email && touched.email ? "input-error" : null
                      }`}
                    />
                    <ErrorMessage
                      name="email"
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
                      component="div"
                      className="errormsg"
                      name="username"
                    />
                  </div>
                  <div className="check-box">
                  <Field type="checkbox" name="is_staff" />
                    <label htmlFor="is_staff">Are you a staff ?</label>
                  </div>
                  <div>
                    <p className="text">
                      Already have an account?
                      <span>
                        <Link to="/login" className="signuplink">
                          Login here
                        </Link>
                      </span>
                    </p>
                  </div>

                  <Button type="submit" className="signupbutton">
                    SignUp
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        );
      }}
    </Formik>
  );
}

export default Signup;
