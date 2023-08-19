import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Results = () => {
  const { query } = useParams();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`/api/results/${query}`)
      .then(response => response.json())
      .then(data => setMovies(data))
      .catch(error => {
        // Handle error
      });
  }, [query]);

  return (
    <div>
      <h1>Search Results for: {query}</h1>
      <ul>
        {movies.map(movie => (
          <li key={movie.id}>{movie.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Results;
