import React, { useState, useEffect } from 'react';

const Movies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch movie data from an API or a local JSON file
    fetch('/api/movies') // Replace with your API endpoint
      .then(response => response.json())
      .then(data => setMovies(data))
      .catch(error => console.error('Error fetching movies:', error));
  }, []);

  return (
    <div className="app">
      {movies.map((movie, index) => (
        <div className="movie-card" key={index}>
          <img className="movie-image" src={movie.image} alt={movie.title} />
          <h2 className="movie-title">{movie.title}</h2>
        </div>
      ))}
    </div>
  );
};

export default Movies;
