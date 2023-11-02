import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./SeatBooking.css";

function SeatBooking() {
  const { id } = useParams();
  const accessToken = localStorage.getItem("accessToken");
  const username = localStorage.getItem("username");

  const [formData, setFormData] = useState({
    category: "Standard",
    date: "",
    time: "01:00:00",
    seatNumbers: [],
    movieName: "",
    theaterId: "",
    theaterName: "",
    theaterAddress: "",
    price: 0,
    user: "",
  });

  const [isBookingSuccessful, setIsBookingSuccessful] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [selectedTheaterId, setSelectedTheaterId] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [theaterNames, setTheaterNames] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    const fetchSeatData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/project/movie/${id}/seats/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const { available, booked } = data;
          setAvailableSeats(available);
          setBookedSeats(booked);
        } else {
          console.error("Failed to fetch seat data:", response.statusText);
        }
      } catch (error) {
        console.error("Failed to fetch seat data:", error.message);
      }
    };

    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/project/movies/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const theaterIds = data.theater.map((theater) => theater.id);
          setSelectedMovie(data);
          setFormData({ ...formData, movieName: data.title });
          fetchTheaters(theaterIds);
        } else {
          console.error("Failed to fetch movie details:", response.statusText);
        }
      } catch (error) {
        console.error("Failed to fetch movie details:", error.message);
      }
    };

    const fetchTheaters = async (theaterIds) => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/project/theaters/?ids=${theaterIds.join(",")}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setTheaterNames(data);
        } else {
          console.error("Failed to fetch theaters:", response.statusText);
        }
      } catch (error) {
        console.error("Failed to fetch theaters:", error.message);
      }
    };

    fetchMovieDetails();
    fetchSeatData();
  }, [accessToken, id]);

  const handleSeatClick = (seatNumber) => {
    const updatedSelectedSeats = [...selectedSeats];

    if (updatedSelectedSeats.includes(seatNumber)) {
      updatedSelectedSeats.splice(updatedSelectedSeats.indexOf(seatNumber), 1);
    } else {
      updatedSelectedSeats.push(seatNumber);
    }

    setSelectedSeats(updatedSelectedSeats);
  };

  const fetchTheaterDetails = async (theaterId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/project/theaters/${theaterId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setFormData({
          ...formData,
          theaterId: data.id,
          theaterName: data.name,
          theaterAddress: data.address,
        });
      } else {
        console.error("Failed to fetch theater details:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to fetch theater details:", error.message);
    }
  };

  const calculateTotalPrice = () => {
    const pricePerSeat =
      formData.category === "Standard"
        ? 10
        : formData.category === "VIP"
        ? 15
        : 8;
    const totalPrice = selectedSeats.length * pricePerSeat;
    setTotalPrice(totalPrice);
    return totalPrice;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
  
    // Prepare the data to be sent to the server
    const requestData = {
      seat_number: selectedSeats,
      category: formData.category,
      date: formData.date,
      time: formData.time,
      theater: formData.theaterId,
    };
  
    try {
      // Send a POST request to book the selected seats
      const response = await fetch(
        `http://127.0.0.1:8000/project/movie/${id}/seats/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestData),
        }
      );
  
      if (response.ok) {
        // Booking was successful
        const data = await response.json();
        setBookingId(data.booking_id);
        setTotalPrice(data.total_price);
        setIsConfirmationModalOpen(true);

        // setIsBookingSuccessful(true);
      } else {
        alert("Seat is already booked...!", response.statusText);
      }
    } catch (error) {
      alert("Booking failed:", error.message);
    }
  };
  
  const handleConfirmBooking = async () => {
    try {
      if (selectedSeats.length === 0) {
        alert("Please select at least one seat.");
        return;
      }

      const totalPrice = calculateTotalPrice();
      setFormData({ ...formData, price: totalPrice });

      const bookingData = {
        seat_number: selectedSeats.join(","),
        category: formData.category,
        date: formData.date,
        time: formData.time,
        price: totalPrice,
        user: username,
        movie: formData.movieName,
        theater: formData.theaterId,
      };

      const response = await fetch(
        `http://127.0.0.1:8000/project/booking-confirmation/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const { booking_id, total_price } = data;
        setBookingId(booking_id);
        setIsBookingSuccessful(true); // Set isBookingSuccessful to true here
        setIsConfirmationModalOpen(true);
      } else {
        alert("Booking failed:", response.statusText);
      }
    } catch (error) {
      alert("Booking failed:", error.message);
    }
  };
  
  const isSeatAvailable = (seatNumber) =>
    availableSeats && availableSeats.includes(seatNumber);

  const isSeatBooked = (seatNumber) =>
    bookedSeats &&
    bookedSeats.includes(seatNumber) &&
    !selectedSeats.includes(seatNumber);

  const seatRows = ["A", "B", "C", "D", "E"];
  const seatColumns = ["1", "2", "3", "4", "5"];

  return (
    <div className="seatform">
      <h2 className="seat-heading">Seat Booking</h2>
      {isBookingSuccessful ? (
        <div className="confirmation-message">
          <p>Booking successful! Your booking ID is: {bookingId}</p>
          <Link to={`/ticket/${bookingId}/`}>
            <button>Generate Ticket</button>
          </Link>
        </div>
      ) :  isConfirmationModalOpen ? (
        <div className="confirmation-modal">
          <h3>Confirm Booking</h3>
          <p>Date: {formData.date}</p>
          <p>Time: {formData.time}</p>
          <p>Movie Name: {formData.movieName}</p>
          <p>Theater Name: {formData.theaterName}</p>
          <p>Theater Address: {formData.theaterAddress}</p>
          <p>Selected Seats: {selectedSeats.join(", ")}</p>
          <p>Total Price: {formData.price} Rs</p>
          <p>category: {formData.category}</p>
          <p>User: {username}</p>
          <button className="modalbutton" onClick={handleConfirmBooking}>Confirm</button>
          <button className="modalbutton" onClick={() => setIsConfirmationModalOpen(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} >
          <div className="select-row" >
            <div>
            <label htmlFor="theaterName">Theater Name:</label>
            <select
              id="theaterName"
              name="theaterName"
              value={formData.theaterId}
              onChange={(e) => {
                setSelectedSeats([]);
                setSelectedTheaterId(e.target.value);
                setFormData({ ...formData, theaterId: e.target.value });
                fetchTheaterDetails(e.target.value);
              }}
            >
              <option value="">Select Theater</option>
              {theaterNames ? (
                theaterNames.map((theater) => (
                  <option key={theater.id} value={theater.id}>
                    {theater.name}
                  </option>
                ))
              ) : (
                <option>Loading theaters...</option>
              )}
            </select>
          </div>
          <div>
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="Standard">Standard</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
          <div>
            <label htmlFor="date">Date:</label>
            <select
              id="date"
              name="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            >
              <option value="">Select Date</option>
              <option value="2023-10-01">2023-10-01</option>
              <option value="2023-10-02">2023-10-02</option>
            </select>
          </div>
          <div>
            <label htmlFor="time">Time:</label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              required
            >
              <option value="01:00:00">01:00:00</option>
              <option value="02:00:00">02:00:00</option>
            </select>
          </div>
          </div>
          <hr/>
          <div className="seat-map">
            {seatRows.map((row) => (
              <div key={row} className="seat-row">
                {seatColumns.map((column) => {
                  const seatNumber = `${row}${column}`;
                  const isSelected = selectedSeats.includes(seatNumber);
                  const isAvailable = isSeatAvailable(seatNumber);
                  const isBooked = isSeatBooked(seatNumber);
                  const seatClass = isAvailable
                    ? "available"
                    : isBooked
                    ? "booked"
                    : "unavailable";

                  return (
                    <div
                      key={seatNumber}
                      className={`seat ${seatClass} ${
                        isSelected ? "selected" : ""
                      }`}
                      onClick={() => handleSeatClick(seatNumber)}
                      title={`Seat: ${seatNumber}`}
                    >
                      {seatNumber}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <button type="submit">Book Seats</button>
        </form>
      )}
    </div>
  );
}

export default SeatBooking;
