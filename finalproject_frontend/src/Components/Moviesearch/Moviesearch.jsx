import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MovieSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    // Fetch movie data from an API
    fetch('/project/search/')
      .then((response) => response.json())
      .then((data) => {
        setMovies(data); // Assuming data is an array of movie objects
        setFilteredMovies(data); // Display all movies initially
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(query) ||
        movie.genre.toLowerCase().includes(query) ||
        movie.language.toLowerCase().includes(query)
    );
    setFilteredMovies(filtered);
  }, [searchQuery, movies]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by title, genre, or language"
        value={searchQuery}
        onChange={handleSearch}
      />
      <div className="movie-list">
        {filteredMovies.map((movie) => (
          <Link
            key={movie.id}
            to={`/api/movies/<int:id>/`} // Link to the movie detail page
            className="movie-card"
          >
            <img src={movie.image} alt={movie.title} />
            <div className="movie-details">
              <h3>{movie.title}</h3>
              <p>Genre: {movie.genre}</p>
              <p>Language: {movie.language}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieSearch;

