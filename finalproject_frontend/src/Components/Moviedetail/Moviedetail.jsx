import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./Moviedetail.css";
const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState([]);
  const username = localStorage.getItem("username"); // Retrieve username from localStorage
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    // Fetch movie data from the API using the provided ID
    fetch(`http://127.0.0.1:8000/project/movies/${id}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })// Update the API endpoint
      .then((response) => response.json())
      .then((data) => {
        setMovie(data); // Assuming data is the movie object
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [id]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="movie-card">
      <div className="movie-image">
        <img src={movie.image} alt={movie.title} />
      </div>
      <hr />
      <div className="movie-details">
        <h2>{movie.title}</h2>
        <p>Genre: {movie.genre}</p>
        <p>Language: {movie.language}</p>
        <p>Rating: {movie.rating}</p>
        <p>Director: {movie.director}</p>
        <p>Movie Length: {movie.movie_length} minutes</p>
        <Link to={`/movie/${id}/seats/`} className="book-now-button">
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default MovieDetail;
