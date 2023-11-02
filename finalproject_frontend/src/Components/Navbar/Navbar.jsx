import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isAuthenticated, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Movie Time</Link>
      </div>
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/">Home</Link>
        </li>
        <li className="navbar-item">
          {isAuthenticated ? (
            <button className="logout" onClick={onLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </li>
      </ul>
      <ul className="navbar-list-right">
        <li className="navbar-item">
          <Link to="/userprofile">profile</Link>
        </li>
        <li className="navbar-item">
          <Link to="/signup">SignUp</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
