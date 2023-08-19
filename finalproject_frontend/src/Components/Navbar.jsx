import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';


const Navbar = () => {
   const [userName, setUserName] = useState('');

  useEffect(() => {
    // Fetch user information from the backend
    fetch('/api/get_user_info/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setUserName(data.username); // Update state with user name
      })
      .catch(error => {
        console.error('Error fetching user information:', error);
      });
  }, []);

  return (
    <nav className="navbar">
      <span className="navbar-toggle" id="js-navbar-toggle">
        <i className="fas fa-bars"></i>
      </span>
      <Link to="login" className="logo">Movie Time</Link>

      <form className="searchBox" action="/search" method="POST">
        <input type="hidden" name="csrfmiddlewaretoken" value="YOUR_CSRF_TOKEN" />
        <input type="text" name="q" className="searchText" placeholder="Search Movies" autoComplete="off" required />
        <button className="searchButton" type="submit">
          <i className="fas fa-search"></i>
        </button>
      </form>

      <div className="main-nav" id="js-menu">
        <Link to="index" className="nav-links">Home</Link>
        <Link to="results?query=all" className="nav-links">Movies</Link>
        <Link to="allTickets" className="nav-links">Bookings</Link>
        <Link to="logout" className="nav-links">Logout</Link>
      </div>

      <div className="user">
        <li>Welcome, USER_NAME</li>
      </div>
    </nav>
  );
};

export default Navbar;
