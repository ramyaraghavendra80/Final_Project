import React, { useEffect, useState } from "react";

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    // Define the API endpoint URL
    const apiUrl = `http://127.0.0.1:8000/project/tickets/`; // Replace with your API URL

    // Use the fetch method to get tickets from the server
    fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Set the retrieved tickets in state
        setTickets(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Ticket List</h2>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            <p>Ticket ID: {ticket.id}</p>
            <p>Booking ID: {ticket.id}</p>
            <p>Category: {ticket.category}</p>
            <p>Movie Name: {ticket.movie}</p>
            <p>Theater Name: {ticket.theater}</p>
            <p>Seat Number(s): {ticket.seat_number.split(", ").join(", ")}</p>
            <p>Date: {ticket.date}</p>
            <p>Time: {ticket.time}</p>
            <p>Price: {parseFloat(ticket.price).toFixed(2)} Rs</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TicketList;
