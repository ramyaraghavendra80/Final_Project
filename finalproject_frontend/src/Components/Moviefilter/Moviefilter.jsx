import React, { useState } from "react";
import "./Moviefilter.css";

const MovieFilter = ({ setMovies }) => {
  const genres = ["Action", "Comedy", "Drama", "Horror", "Science Fiction"];
  const languages = ["English", "Spanish", "German", "French", "Japanese"];
  const locations = ["New York","Los Angeles","Chicago","San Francisco","Miami"];
  const ratings = ["G", "PG", "PG-13", "R"];

  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const accessToken = localStorage.getItem("accessToken");

  const handleFilterMovies = () => {
    // Fetch movies based on selected filters
    fetch(
      `http://127.0.0.1:8000/project/movies/?genre=${selectedGenre}&language=${selectedLanguage}&location=${selectedLocation}&rating=${selectedRating}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },} )
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
      })
      .catch((error) => {
        console.error("Error fetching filtered movies:", error);
      });
  };

  return (
    <div className="movie-filter">
      <div className="filter-row">
        <div className="filter-options">
          <label>Genre:</label>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">Select Genre</option>
            {genres.map((genre, i) => (
              <option key={i} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-options">
          <label>Language:</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="">Select Language</option>
            {languages.map((language, i) => (
              <option key={i} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-options">
          <label>Location:</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">Select Location</option>
            {locations.map((location, i) => (
              <option key={i} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-options">
          <label>Rating:</label>
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
          >
            <option value="">Select Rating</option>
            {ratings.map((rating, i) => (
              <option key={i} value={rating}>
                {rating}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleFilterMovies}>Apply Filters</button>
      </div>
    </div>
  );
};

export default MovieFilter;
