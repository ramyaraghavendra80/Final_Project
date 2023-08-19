import React from 'react';
import './Home.css';
import Moviefilter from '../Moviefilter/Moviefilter';


function Home() {
  return (
    <div className="container">
      <div className="filter-container">
        <h2>Movie Filter</h2>
        <Moviefilter/>
      </div>
      <div className="movie-list-container">
        <h2>Movie List</h2>
        
      </div>
    </div>
  );
}

export default Home;
