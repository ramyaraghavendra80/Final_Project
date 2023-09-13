import React from "react";
import "./Home.css";
import MovieSearch from "../Moviesearch/Moviesearch";
import Movies from  "../Movies/Movies";

function Home() {
  return (
    <div className="container">
      <h1>GET <font color='#32CD32'>MOVIE</font> TICKETS</h1>
      <h3>
        Buymovie tickets in advance, find movie times watch trailers,
        <br />
        read movie reviews and much more
      </h3>
      <div className="filter-container">
        <h6>Welcome to MovieTime</h6>
        <h4>What are you looking for</h4>
        <div className="second-container">
          <MovieSearch/>
        </div>
        <div>
          <Movies/>
        </div>
      </div>
    </div>
  );
}

export default Home;
