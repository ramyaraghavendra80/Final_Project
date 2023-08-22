import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    // Fetch movie data from the API using the provided ID
    fetch(`/api/movies/<int:id>/`) // Update the API endpoint
      .then((response) => response.json())
      .then((data) => {
        setMovie(data); // Assuming data is the movie object
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [id]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{movie.title}</h2>
      <div className="movie-card">
        <img src={movie.image} alt={movie.title} />
        <div className="movie-details">
          <p>Genre: {movie.genre}</p>
          <p>Language: {movie.language}</p>
          <p>Rating: {movie.rating}</p>
          <p>Director: {movie.director}</p>
          <p>Movie Length: {movie.movie_length} minutes</p>
        </div>
      </div>
      <Link to={`/movie/<int:id>/booking/`} className="book-now-button">
        Book Now
      </Link>
    </div>
  );
};

export default MovieDetail;


