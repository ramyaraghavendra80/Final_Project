import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const MoviePage = () => {
  const { movieName } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`/api/movie/${movieName}`)
      .then(response => response.json())
      .then(data => setMovie(data))
      .catch(error => {
        // Handle error
      });
  }, [movieName]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{movie.name}</h1>
      <p>{movie.about}</p>
    </div>
  );
};

export default MoviePage;
