import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const BookTicket = () => {
  const { movieName } = useParams();
  const [currentCity, setCurrentCity] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [dayList, setDayList] = useState([]);
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch current city and date
    fetch('/api/current_city_and_date/')
      .then(response => response.json())
      .then(data => {
        setCurrentCity(data.currentCity);
        setCurrentDate(data.currentDate);
      })
      .catch(error => {
        setError('Error fetching current city and date.');
      });

    // Fetch day list for the movie
    fetch(`/api/day_list/${movieName}/`)
      .then(response => response.json())
      .then(data => setDayList(data.dayList))
      .catch(error => {
        setError('Error fetching day list for the movie.');
      });

    // Fetch shows for the selected movie, city, day, and hall
    fetch(`/api/shows/${movieName}/${currentCity}/${selectedDate}/${selectedHall}`)
      .then(response => response.json())
      .then(data => setShows(data.shows))
      .catch(error => {
        setError('Error fetching shows for the selected movie, city, day, and hall.');
      });

    // Update shows when selectedDate changes
    if (selectedDate) {
      fetch(`/api/shows/${movieName}/${currentCity}/${selectedDate}/${selectedHall}`)
        .then(response => response.json())
        .then(data => setShows(data.shows))
        .catch(error => {
          setError('Error updating shows for the selected date.');
        });
    }
  }, [movieName, currentCity, selectedDate, selectedHall]);

  const handleShowSelection = (show) => {
    setSelectedShow(show);
  };

  const handleDateSelection = (date) => {
    setSelectedDate(date);
  };

  const handleSeatSelection = (seat) => {
    // Toggle seat selection
    setSelectedSeats((prevSeats) =>
      prevSeats.includes(seat)
        ? prevSeats.filter((s) => s !== seat)
        : [...prevSeats, seat]
    );
  };

  const handleSubmitBooking = async () => {
    try {
      if (!selectedShow || !selectedDate || selectedSeats.length === 0) {
        // Handle validation or show an error message
        return;
      }
  
      // Make an API call to submit the booking
      const response = await fetch('/api/book_ticket/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          showId: selectedShow.id,
          date: selectedDate,
          selectedSeats: selectedSeats,
        }),
      });
  
      if (response.ok) {
        // Handle booking success
        console.log('Booking successful!');
        // You can also redirect the user to a confirmation page or perform other actions here
      } else {
        // Handle booking failure
        console.error('Booking failed');
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };
  

  return (
    <div>
    {/* Error message display */}
      {error && <p>Error: {error}</p>}
      <h2>Book Tickets for {movieName}</h2>
      <p>City: {currentCity}</p>
      <p>Today: {currentDate}</p>

      <div>
        <h3>Select a Show:</h3>
        <ul>
          {shows.map((show) => (
            <li key={show.id}>
              Date: {show.date} | Time: {show.time}
              <button onClick={() => handleShowSelection(show)}>Book Tickets</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Select Date:</h3>
        <ul>
          {dayList.map((date) => (
            <li key={date}>
              <button onClick={() => handleDateSelection(date)}>{date}</button>
            </li>
          ))}
        </ul>
      </div>

      {selectedShow && selectedDate && (
        <div>
          <h3>Selected Show Details:</h3>
          <p>Movie: {selectedShow.movie}</p>
          <p>Date: {selectedDate}</p>

          <div>
            <h3>Select Seats:</h3>
            <div className="seat-selection">
              {selectedShow.seats.map((rowSeats, row) => (
                <div key={row} className="seat-row">
                  {rowSeats.map((status, col) => (
                    <button
                      key={col}
                      className={`seat ${status === 'Vacant' ? 'vacant' : 'occupied'} ${
                        selectedSeats.includes(`${row}${col}`) ? 'selected' : ''
                      }`}
                      onClick={() => handleSeatSelection(`${row}${col}`)}
                      disabled={status === 'Occupied'}
                    >
                      {row}
                      {col}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleSubmitBooking}>Book Now</button>
        </div>
      )}
    </div>
  );
};

export default BookTicket;
