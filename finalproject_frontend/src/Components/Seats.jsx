import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Seats = () => {
  const { show } = useParams();
  const [seatMap, setSeatMap] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [bookingEnabled, setBookingEnabled] = useState(false); // Enable/disable booking
  const [bookingInProgress, setBookingInProgress] = useState(false); // Track booking progress

  useEffect(() => {
    // Fetch seat data and set state variables here...
    fetch(`/api/seats/${show}`)
      .then(response => response.json())
      .then(data => {
        setSeatMap(data.seatMap);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching seat data:', error);
        setIsLoading(false);
      });
  }, [show]);

  const handleSeatSelection = (seat) => {
    // Toggle seat selection
    setSelectedSeats((prevSeats) =>
      prevSeats.includes(seat)
        ? prevSeats.filter((s) => s !== seat)
        : [...prevSeats, seat]
    );
  };

  const handleSeatBooking = () => {
    // Handle seat booking logic here...
    if (selectedSeats.length > 0) {
      setBookingInProgress(true);
      // Make an API call to book selected seats
      fetch(`/api/book_seats/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          show: show,
          selectedSeats: selectedSeats
        })
      })
      .then(response => response.json())
      .then(data => {
        // Handle success or error response
        setBookingInProgress(false);
      
        if (data.success) {
          const updatedSeatMap = [...seatMap]; // Create a copy of the seatMap
          selectedSeats.forEach(seat => {
            const [row, col] = seat.split('');
            updatedSeatMap[row][col] = 'Occupied';
          });
          setSeatMap(updatedSeatMap);
        } else {
          // Handle booking error
          console.error('Booking error:', data.error); // Log the error message
        }
      })
      .catch(error => {
        console.error('Error booking seats:', error);
        setBookingInProgress(false);
      });
      
    }
  };

  const renderSeatMap = () => {
    return seatMap.map((rowSeats, row) => (
      <div key={row} className="seat-row">
        {rowSeats.map((status, col) => (
          <button
            key={col}
            className={`seat ${status === 'Vacant' ? 'vacant' : 'occupied'} ${
              selectedSeats.includes(`${row}${col}`) ? 'selected' : ''
            }`}
            onClick={() => handleSeatSelection(`${row}${col}`)}
            disabled={status === 'Occupied' || bookingInProgress}
          >
            {row}
            {col}
          </button>
        ))}
      </div>
    ));
  };

  return (
    <div>
      <h2>Seat Selection</h2>
      <p>Select your seats for the show</p>

      <div className="seat-map">
        {isLoading ? (
          <p>Loading seat data...</p>
        ) : (
          renderSeatMap()
        )}
      </div>

      <button
        onClick={handleSeatBooking}
        disabled={selectedSeats.length === 0 || bookingInProgress || !bookingEnabled}
      >
        {bookingInProgress ? 'Booking...' : 'Book Seats'}
      </button>
    </div>
  );
};

export default Seats;
