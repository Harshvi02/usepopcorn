
import "./index.css";
const tempMovies = [
  {
    imdbID: "tt4154796",
    Title: "Avengers: Endgame",
    Year: "2019",
    Poster: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwODk5MTU3NzM@._V1_SX300.jpg",
  },
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster: "https://m.media-amazon.com/images/M/MV5BMmFlZjQwYzItN2NhMC00ZDJhLTg1YzUtYzZjZjNjOGZjNWJhXkEyXkFqcGc@._V1_SX300.jpg",
  },
];

export default function App() {
  return (
    <>
      <NavBar />
      <Main />
    </>
  );
}



function NavBar() {
  return (
    <nav className="nav-bar">
      <h1>🍿 usePopcorn</h1>
      <input type="text" placeholder="Search movies..." />
    </nav>
  );
}
function Main() {
  return (
    <main className="main">
      <div className="box">
        <MovieList movies={tempMovies} />
      </div>

      <div className="box">
        Watched List
      </div>
    </main>
  );
}

function MovieList({ movies }) {
  return (
    <ul>
      {movies.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
}
function Movie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={movie.Title} width="40" />
      
      <p>{movie.Year}</p>
    </li>
  );
}

