import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import "./Ticket.css";

function Ticket() {
  const { id } = useParams();
  const [bookingData, setBookingData] = useState(null);
  const [isTicketSaved, setIsTicketSaved] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const username = localStorage.getItem("username");

  useEffect(() => {
    // Fetch booking data based on bookingId from your API
    fetch(`http://127.0.0.1:8000/project/booking-confirmation/${id}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setBookingData(data); // Assuming data contains booking details
      })
      .catch((error) => {
        console.error("Error fetching booking data:", error);
      });
  }, [id]);

  const generatePDF = () => {
    if (bookingData) {
      // Create a new PDF document
      const doc = new jsPDF();

      // Define content for the ticket
      const content = `
      Ticket Details
      ---------------
      Booking ID: ${bookingData.id}
      Category: ${
        bookingData.category || "N/A"
      } // Use 'N/A' as a fallback for null
      Movie Name: ${bookingData.movie}
      Theater ID: ${bookingData.theater}
      Seat Number(s): ${bookingData.seat_number.split(", ").join(", ")} // Parse seat_number as JSON
      Price: ${parseFloat(bookingData.price).toFixed(
        2
      )} Rs // Parse and format the price
    `;

      // Add content to the PDF
      doc.text(content, 10, 10);

      // Save the PDF with a unique name
      const fileName = `Ticket_${bookingData.id}.pdf`;
      doc.save(fileName);

      // Set the ticket as saved
      setIsTicketSaved(true);
    }
  };

  const saveTicketData = async () => {
    try {
      if (bookingData) {
        // Create an object with the correct property names for the POST request
        const ticketDataToSave = {
          booking: bookingData.id,
          movie_name: bookingData.movie,
          category: bookingData.category || "N/A", // Use 'N/A' as a fallback for null
          theater_name: `Theater ${bookingData.theater}`,
          seat_numbers: bookingData.seat_number.split(", ").join(", "), // Parse seat_number as JSON
          total_price: parseFloat(bookingData.price).toFixed(2),
          date: bookingData.date,
          time: bookingData.time,
        };

        // Send a POST request to save the ticket data
        const response = await fetch(
          `http://127.0.0.1:8000/project/tickets/${id}/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(ticketDataToSave),
          }
        );

        if (response.status === 201) {
          setIsTicketSaved(true);
        }
      }
    } catch (error) {
      console.error("Error saving ticket data:", error);
    }
  };

  if (!bookingData) {
    return <p>Loading booking data...</p>;
  }

  return (
    <div className="ticketform">
      <h2 className="ticketheading" >Ticket Details</h2>
      <hr/>
      <div className="ticketbody">
        <p>Booking ID: {bookingData.id}</p>
        <p>Category: {bookingData.category}</p>
        <p>Movie Name: {bookingData.movie}</p>
        <p>Theater Name: {bookingData.theater}</p>
        <p>Seat Number(s): {bookingData.seat_number.split(", ").join(", ")}</p>
        <p>Date: {bookingData.date}</p>
        <p>Time: {bookingData.time}</p>
        <p>Price: {parseFloat(bookingData.price).toFixed(2)} Rs</p>
        {isTicketSaved ? (
          <div className="success-message">
            <p>Ticket data saved successfully!</p>
            <button onClick={generatePDF}>Download Ticket</button>
          </div>
        ) : (
          <div>
            <button className="generatebutton" onClick={saveTicketData}>Generate & Save Ticket</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Ticket;
