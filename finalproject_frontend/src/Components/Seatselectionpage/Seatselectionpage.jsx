// SeatSelectionPage.js
import React, { useState, useEffect } from 'react';
import './SeatSelectionPage.css';

const SeatSelectionPage = () => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const seatPrice = {
    regular: 10,
    vip: 20
  };

  useEffect(() => {
    // Fetch seat data from Django API
    fetch('/project/seats/')
      .then(response => response.json())
      .then(data => setSeats(data))
      .catch(error => console.error('Error fetching seat data:', error));
  }, []);

  const handleSeatClick = (seat) => {
    const isSeatSelected = selectedSeats.some(
      selectedSeat => selectedSeat.id === seat.id
    );

    if (isSeatSelected) {
      setSelectedSeats(prevSeats =>
        prevSeats.filter(prevSeat => prevSeat.id !== seat.id)
      );
    } else {
      setSelectedSeats(prevSeats => [...prevSeats, seat]);
    }
  };

  const calculateTotalCost = () => {
    return selectedSeats.reduce((total, seat) => {
      const seatType = seat.category;
      return total + seatPrice[seatType];
    }, 0);
  };

  const handleConfirmClick = () => {
    if (selectedSeats.length > 0) {
      const selectedSeatIds = selectedSeats.map(seat => seat.id);
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seat_ids: selectedSeatIds })
      };

      // Create reservations on the backend
      fetch('/project/reservations/', requestOptions)
        .then(response => {
          // Handle successful reservation, e.g., show confirmation message
        })
        .catch(error => {
          console.error('Error creating reservation:', error);
          // Handle reservation error, e.g., show error message
        });
    } else {
      // Handle case where no seats are selected
    }
  };

  return (
    <div className="seat-selection-page">
      <div className="seat-map">
        {seats.map(seat => (
          <div
            key={seat.id}
            className={`seat ${
              selectedSeats.some(selectedSeat => selectedSeat.id === seat.id)
                ? 'selected'
                : ''
            }`}
            onClick={() => handleSeatClick(seat)}
          >
            <div className="seat-info">
              <p>Row {seat.row + 1}, Seat {seat.seat_number + 1}</p>
              <p>Movie: {seat.movie.title}</p>
              <p>Theater: {seat.theater.name}</p>
              <p>Price: ${seatPrice[seat.category]}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="seat-summary">
        <h2>Seat Summary</h2>
        <ul className="selected-seats">
          {selectedSeats.map((seat, index) => (
            <li key={index}>
              Row {seat.row + 1}, Seat {seat.seat_number + 1} ({seat.category})
            </li>
          ))}
        </ul>
        <p>Total Cost: ${calculateTotalCost()}</p>
        <button className="confirm-button" onClick={handleConfirmClick}>
          Confirm Selection
        </button>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
