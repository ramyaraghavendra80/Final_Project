import "./Movies.css";
import { Link } from "react-router-dom";

const Movies = ({ movie }) => {
  const movieDetailLink = `/movies/${movie.id}/`;

  return (
    <Link to={movieDetailLink} className="moviecard">
      <img className="movieimage" src={movie.image} alt={movie.title} />
      <hr />
      <div class="card-body">
        <p className="movietitle">{movie.title}</p>
      </div>
    </Link>
  );
  
};

export default Movies;
