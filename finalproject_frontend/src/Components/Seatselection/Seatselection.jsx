import React, { useState, useEffect } from 'react';
import { useLocation,useParams, Link  } from 'react-router-dom';

const SeatSelection = () => {
  const { id } = useParams(); // Extract the movie ID from the URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const selectedDate = searchParams.get('date');
  const selectedTime = searchParams.get('time');
  const selectedTheater = searchParams.get('theater');

  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Fetch movie data from the API using the provided ID
    fetch(`/api/movies/<int:id>/`) // Update the API endpoint
      .then((response) => response.json())
      .then((data) => {
        setMovie(data); 
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [id]);

  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleConfirmBooking = () => {
    // Calculate total price based on selected seats and category
    // Assuming different seat prices for different categories
    let pricePerSeat = 0;
    if (selectedCategory === 'VIP') {
      pricePerSeat = 15; // Example VIP price
    } else if (selectedCategory === 'Balcony') {
      pricePerSeat = 10; // Example Balcony price
    } else {
      pricePerSeat = 8; // Example Standard price
    }
    const totalPrice = selectedSeats.length * pricePerSeat;
    setTotalPrice(totalPrice);
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  // Generate an array of available and booked seats (just an example)
  const allSeats = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3'];
  const bookedSeats = ['A1', 'B2']; // Example booked seats

  return (
    <div>
      <h2>Select Seats</h2>
      <p>Date: {selectedDate}</p>
      <p>Time: {selectedTime}</p>
      <p>Theater: {selectedTheater}</p>
      <div className="seat-selection-container">
        <div className="seat-map">
          {allSeats.map(seat => (
            <div
              key={seat}
              className={`seat ${bookedSeats.includes(seat) ? 'booked' : selectedSeats.includes(seat) ? 'selected' : 'available'}`}
              onClick={() => handleSeatClick(seat)}
            >
              {seat}
            </div>
          ))}
        </div>
        <div className="category-selection">
          <label>Select Category:</label>
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">Select Category</option>
            <option value="VIP">VIP</option>
            <option value="Balcony">Balcony</option>
            <option value="Standard">Standard</option>
          </select>
        </div>
      </div>
      <Link
        to={{
          pathname: `/movie/<int:id>/booking/ticket/`,
          state: {
            selectedSeats,
            selectedCategory,
            totalPrice,
            movieTitle: movie.title,
            selectedDate,
            selectedTime,
            selectedTheater
          }
        }}
        className="book-now-button"
        onClick={handleConfirmBooking}
        disabled={selectedSeats.length === 0 || selectedCategory === ''}
      >
        Confirm Booking
      </Link>
    </div>
  );
};

export default SeatSelection;
