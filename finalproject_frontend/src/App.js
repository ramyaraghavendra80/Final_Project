import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';
import Navbar from './Navbar';


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST', 
        headers: {
          'Authorization': 'Bearer YOUR_AUTH_TOKEN', // Add authorization header if needed
        },
      });

      if (response.ok) {
       
        localStorage.removeItem('authToken');
        setIsAuthenticated(false); // Update isAuthenticated state
      } else {
        // Handle logout error
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };
  return (
    <BrowserRouter>
    <div className="App">
    <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
          <Route exact path="/" component={<Home/>} />
          <Route path="/login" component={<Login/>} />
          <Route path='/signup' element={<Signup />}/>
      </Routes>
    </div>
    </BrowserRouter>

  );
}

export default App;
