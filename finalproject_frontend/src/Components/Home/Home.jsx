import React, { useState, useEffect } from "react";
import "./Home.css";
import MovieFilter from "../Moviefilter/Moviefilter";
import Movies from "../Movies/Movies";

function Home() {
  const [movies, setMovies] = useState([]);
  const username = localStorage.getItem("username"); // Retrieve username from localStorage
  const accessToken = localStorage.getItem("accessToken");
  const [shouldRedirect, setShouldRedirect] = useState(false); // State for redirection

  useEffect(() => {
    if (!accessToken) {
      // If not authenticated, set shouldRedirect to true
      setShouldRedirect(true);
      return;
    }

    fetch("http://127.0.0.1:8000/project/movies/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unauthorized or other error");
        }
        return response.json();
      })
      .then((data) => setMovies(data))
      .catch((error) => {
        console.error("Error fetching movies:", error);
        // Handle the error as needed
      });
  }, [accessToken]);

  useEffect(() => {
    // Use this effect for redirection when shouldRedirect changes
    if (shouldRedirect) {
      window.location.href = "/login"; // Redirect to the login page
    }
  }, [shouldRedirect]);

  return (
    <div className="homecontainer">
      <h1>Welcome, {username}!</h1> {/* Display the retrieved username */}
      <div className="top-container">
        <MovieFilter setMovies={setMovies} />
      </div>
      <div className="bottom-container">
        <div className="moviecontainer">
          {movies && movies.length > 0 ? (
            movies.map((movie, i) => <Movies key={i} movie={movie} />)
          ) : (
            <p>Loading....</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
