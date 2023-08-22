import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import MovieSearch from "./Components/Moviesearch/Moviesearch";
import MovieDetail from "./Components/Moviedetail/Moviedetail";
import BookingTicket from "./Components/BookingTicket/BookingTicket";
import SeatSelection from "./Components/Seatselection/Seatselection";
import ForgotPassword from "./Components/Forgotpassword/Forgotpassword";
import TicketPage from "./Components/Ticket/Ticket";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: "Bearer YOUR_AUTH_TOKEN", // Add authorization header if needed
        },
      });

      if (response.ok) {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false); // Update isAuthenticated state
      } else {
        // Handle logout error
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
          <Route exact path="/moviesearch" element={<MovieSearch />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/movie/:id/booking" element={<BookingTicket />} />
          <Route
            path="/movie/:id/booking/seat-selection"
            element={<SeatSelection />}
          />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/ticket" element={<TicketPage />} />

      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
