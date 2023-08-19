import React, { useState } from 'react';

const Ticket = () => {
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  const handleSeatSelection = (seat) => {
    // Toggle seat selection
    setSelectedSeats((prevSeats) =>
      prevSeats.includes(seat)
        ? prevSeats.filter((s) => s !== seat)
        : [...prevSeats, seat]
    );
  };

  const calculateTotalCost = () => {
    // Calculate total cost based on selected seats and show rate
    if (selectedShow) {
      const costPerSeat = selectedShow.rate; // Replace with the actual property name
      const numberOfSelectedSeats = selectedSeats.length;
      const total = costPerSeat * numberOfSelectedSeats;
      setTotalCost(total);
    }
  };

  const handleSubmitBooking = () => {
    // Handle booking submission with selectedShow and selectedSeats
    if (selectedShow && selectedSeats.length > 0) {
      // Make an API call to submit the booking with selectedShow and selectedSeats
      // You can use the fetch API or an external library like axios
      // Example using fetch:
      fetch('/api/book_tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          show: selectedShow.id,
          seats: selectedSeats,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle success or error response
          console.log('Booking response:', data);
          // Clear selected seats and total cost
          setSelectedSeats([]);
          setTotalCost(0);
        })
        .catch((error) => {
          console.error('Error booking tickets:', error);
        });
    }
  };

  return (
    <div>
      <h2>Book Your Tickets</h2>
      <p>Select your seats and complete your booking</p>

      {selectedShow && (
        <div>
          <h3>Selected Show:</h3>
          <p>Movie: {selectedShow.movie}</p>
          <p>Date: {selectedShow.date}</p>
          <p>Time: {selectedShow.time}</p>
        </div>
      )}

      <div>
        <h3>Select Seats:</h3>
        {/* Render seat selection UI based on selectedShow */}
      </div>

      <div>
        <h3>Selected Seats:</h3>
        <ul>
          {selectedSeats.map((seat) => (
            <li key={seat}>{seat}</li>
          ))}
        </ul>
        <p>Total Cost: ${totalCost}</p>
      </div>

      <button onClick={handleSubmitBooking}>Book Now</button>
    </div>
  );
};

export default Ticket;
