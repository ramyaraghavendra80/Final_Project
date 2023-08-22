import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const BookingTicket = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTheater, setSelectedTheater] = useState("");

  useEffect(() => {
    // Fetch movie data from the API using the provided ID
    fetch(`/api/movies/${id}/`) // Update the API endpoint
      .then((response) => response.json())
      .then((data) => {
        setMovie(data); // Assuming data is the movie object
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [id]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleTheaterChange = (event) => {
    setSelectedTheater(event.target.value);
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Select Booking Details</h2>

      {/* Display movie details */}
      <div className="movie-details">
        <h3>{movie.title}</h3>
        <p>Genre: {movie.genre}</p>
        <p>Language: {movie.language}</p>
        <p>Rating: {movie.rating}</p>
      </div>

      {/* Select date */}
      <label>Date:</label>
      <input type="date" value={selectedDate} onChange={handleDateChange} />

      {/* Select time */}
      <label>Time:</label>
      <select value={selectedTime} onChange={handleTimeChange}>
        <option value="12:00 PM">12:00 PM</option>
        <option value="3:00 PM">3:00 PM</option>
        {/* ... (other time options) */}
      </select>

      {/* Select theater */}
      <label>Theater:</label>
      <select value={selectedTheater} onChange={handleTheaterChange}>
        <option value="Theater A">Theater A</option>
        <option value="Theater B">Theater B</option>
        {/* ... (other theater options) */}
      </select>

      {/* "Book Now" button */}
      <Link
        to={{
          pathname: `/movie/${id}/booking/seat-selection/`,
          search: `?date=${selectedDate}&time=${selectedTime}&theater=${selectedTheater}`,
        }}
        className="book-now-button"
      >
        Book Now
      </Link>
    </div>
  );
};

export default BookingTicket;
