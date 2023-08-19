import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Shows = () => {
  const { movie, city, day, hall } = useParams();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedHall, setSelectedHall] = useState(null);
  const [showList, setShowList] = useState([]);

  useEffect(() => {
    // Fetch selected movie details
    fetch(`/api/movies/${movie}/`)
      .then(response => response.json())
      .then(data => setSelectedMovie(data.name))
      .catch(error => {
        console.error('Error fetching selected movie details:', error);
      });

    // Fetch selected city details
    fetch(`/api/cities/${city}/`)
      .then(response => response.json())
      .then(data => setSelectedCity(data.name))
      .catch(error => {
        console.error('Error fetching selected city details:', error);
      });

    // Fetch selected day details
    fetch(`/api/day/${day}/`)
      .then(response => response.json())
      .then(data => setSelectedDay(data.day))
      .catch(error => {
        console.error('Error fetching selected day details:', error);
      });

    // Fetch selected hall details
    fetch(`/api/hall/${hall}/`)
      .then(response => response.json())
      .then(data => setSelectedHall(data.name))
      .catch(error => {
        console.error('Error fetching selected hall details:', error);
      });

    // Fetch show list for the selected criteria
    fetch(`/api/shows/${movie}/${city}/${day}/${hall}/`)
      .then(response => response.json())
      .then(data => setShowList(data))
      .catch(error => {
        console.error('Error fetching show list for the selected criteria:', error);
      });
  }, [movie, city, day, hall]);

  return (
    <div>
      <h2>Shows for Selected Criteria</h2>
      
      <div>
        <p>Selected Movie: {selectedMovie}</p>
        <p>Selected City: {selectedCity}</p>
        <p>Selected Day: {selectedDay}</p>
        <p>Selected Hall: {selectedHall}</p>
      </div>
      
      <ul>
        {showList.map((show) => (
          <li key={show.id}>
            <p>Movie: {show.movie}</p>
            <p>Date: {show.date}</p>
            <p>Time: {show.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Shows;
