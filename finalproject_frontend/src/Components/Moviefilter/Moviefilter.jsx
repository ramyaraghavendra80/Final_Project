import React, { useState, useEffect } from 'react';

const MovieFilter = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);

  useEffect(() => {
    // Fetch the list of movies from an API endpoint
    fetch('your_movie_api_endpoint')
      .then(response => response.json())
      .then(data => {
        setMovies(data);
        setFilteredMovies(data);
      })
      .catch(error => console.error('Error fetching movies:', error));
  }, []);

  useEffect(() => {
    // Apply filters to the list of movies
    const filtered = movies.filter(movie => {
      const matchesGenre = selectedGenres.length === 0 || selectedGenres.includes(movie.genre);
      const matchesLanguage = selectedLanguages.length === 0 || selectedLanguages.includes(movie.language);
      const matchesRating = selectedRatings.length === 0 || selectedRatings.includes(movie.rating);
      return matchesGenre && matchesLanguage && matchesRating;
    });
    setFilteredMovies(filtered);
  }, [selectedGenres, selectedLanguages, selectedRatings, movies]);

  const handleGenreChange = event => {
    const value = event.target.value;
    setSelectedGenres(prevSelected => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter(genre => genre !== value);
      } else {
        return [...prevSelected, value];
      }
    });
  };

  const handleLanguageChange = event => {
    const value = event.target.value;
    setSelectedLanguages(prevSelected => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter(language => language !== value);
      } else {
        return [...prevSelected, value];
      }
    });
  };

  const handleRatingChange = event => {
    const value = event.target.value;
    setSelectedRatings(prevSelected => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter(rating => rating !== value);
      } else {
        return [...prevSelected, value];
      }
    });
  };

  return (
    <div>
      <h1>Movie Filtering</h1>
      <div>
        <h2>Genres</h2>
        {['Comedy', 'Horror', 'Action', 'Drama', 'Science Fiction'].map(genre => (
          <label key={genre}>
            <input
              type="checkbox"
              value={genre}
              checked={selectedGenres.includes(genre)}
              onChange={handleGenreChange}
            />
            {genre}
          </label>
        ))}
      </div>
      <div>
        <h2>Languages</h2>
        {['English', 'Spanish', 'German', 'French', 'Italian'].map(language => (
          <label key={language}>
            <input
              type="checkbox"
              value={language}
              checked={selectedLanguages.includes(language)}
              onChange={handleLanguageChange}
            />
            {language}
          </label>
        ))}
      </div>
      <div>
        <h2>Ratings</h2>
        {['PG', 'PG-13', 'R', 'NC-17'].map(rating => (
          <label key={rating}>
            <input
              type="checkbox"
              value={rating}
              checked={selectedRatings.includes(rating)}
              onChange={handleRatingChange}
            />
            {rating}
          </label>
        ))}
      </div>
      <div>
        <h2>Filtered Movies</h2>
        <ul>
          {filteredMovies.map(movie => (
            <li key={movie.id}>{movie.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MovieFilter;
