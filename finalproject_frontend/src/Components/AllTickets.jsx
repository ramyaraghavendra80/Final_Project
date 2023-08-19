import React, { useState, useEffect } from 'react';

const AllTickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    // Fetch user's ticket data and set state variable here...
    fetch('/api/user_tickets')
      .then((response) => response.json())
      .then((data) => {
        setTickets(data);
      })
      .catch((error) => {
        console.error('Error fetching user tickets:', error);
      });
  }, []);

  return (
    <div>
      <h2>Your Tickets</h2>
      <p>Here are your booked tickets:</p>

      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            <p>Show: {ticket.show.movie}</p>
            <p>Date: {ticket.show.date}</p>
            <p>Time: {ticket.show.time}</p>
            <p>Seats: {ticket.seat.seatList.join(', ')}</p>
            <p>Cost: ${ticket.cost}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllTickets;
