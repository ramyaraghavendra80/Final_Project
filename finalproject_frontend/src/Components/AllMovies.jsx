import React, { useState, useEffect } from 'react';

const AllMovies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch all movie data and set state variable here...
    fetch('/api/all_movies')
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
      })
      .catch((error) => {
        console.error('Error fetching all movies:', error);
      });
  }, []);

  return (
    <div>
      <h2>All Movies</h2>
      <p>Here are all the movies:</p>

      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <p>Title: {movie.name}</p>
            <p>About: {movie.about}</p>
            <img src={movie.poster} alt={`${movie.name} Poster`} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllMovies;
