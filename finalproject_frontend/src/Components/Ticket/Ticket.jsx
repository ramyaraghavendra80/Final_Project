import React from 'react';
import { useLocation,useParams, Link  } from 'react-router-dom';
import { toast } from 'react-toastify';


const TicketPage = () => {
  const location = useLocation();
  const { selectedSeats, selectedCategory, totalPrice, movie} = location.state;

  const { id } = useParams();


  const handleConfirm = async () => {
    // Prepare booking data
    const bookingData = {
      selectedSeats,
      selectedCategory,
      totalPrice,
      movieTitle: movie.title,
      movieId: parseInt(id),
    };

    // Send POST request to save booking
    try {
      const response = await fetch('/movie/<int:id>/booking/ticket/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        toast.success('Booking successful!', {
          position: 'top-right',
          autoClose: 3000, // Close after 3 seconds
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        // Handle error
        console.error('Failed to save booking');
      }
    } catch (error) {
      // Handle network error
      console.error('Network error:', error);
    }
  };

  return (
    <div>
      <h2>Your Booking Details</h2>
      <p>Selected Movie: {selectedSeats.join(', ')}</p>
      <p>Selected Seats: {selectedSeats.join(', ')}</p>
      <p>Category: {selectedCategory}</p>
      <p>Total Price: ${totalPrice}</p>
      <button onClick={handleConfirm}>Confirm Booking</button>
      <Link to="/success">Go to Success Page</Link>
    </div>
  );
};

export default TicketPage;
