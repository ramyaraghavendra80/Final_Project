import React, { useState, useEffect } from 'react';

const Index = () => {
  const [randomMovies, setRandomMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch random movies from an API
    fetch('/api/random_movies/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setRandomMovies(data))
      .catch(error => {
        setError(error.message); // Set the error message in state
      });
  }, []);

  return (
    <div>
      <h1>Random Movies</h1>
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <ul>
          {randomMovies.map(movie => (
            <li key={movie.id}>{movie.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Index;

