import React from 'react';
import { Link } from 'react-router-dom';
import '../Navbar/Navbar';

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
        {isAuthenticated ? (
          <li className="navbar-item">
            <button onClick={onLogout}>Logout</button>
          </li>
        ) : (
          <li className="navbar-item">
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
