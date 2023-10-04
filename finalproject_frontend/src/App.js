import React, { useState } from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";

import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import MovieDetail from "./Components/Moviedetail/Moviedetail";
import SeatBooking from "./Components/SeatBooking/SeatBooking";
import ForgotPassword from "./Components/Forgotpassword/Forgotpassword";
import Ticket from "./Components/Ticket/Ticket";
import TicketList from "./Components/Ticketlist/Ticketlist";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("accessToken") ? true : false
  );

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        const response = await fetch(`http://127.0.0.1:8000/project/logout/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          localStorage.removeItem("accessToken");
          setIsAuthenticated(false);
          window.location.href = "/login";
        } else {
          console.error("Logout failed");
        }
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <Routes>
          <Route path="/movies/:id/" element={<MovieDetail />} />
          <Route path="/movie/:id/seats/" element={<SeatBooking/>}/>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/ticket/:id/" element={<Ticket />} />
          <Route path="/tickets" element={<TicketList />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
