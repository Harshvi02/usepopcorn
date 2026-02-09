import { useState } from "react";

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
    Title: 
"Inception",
    Year: "2010",
    Poster: "https://m.media-amazon.com/images/M/MV5BMmFlZjQwYzItN2NhMC00ZDJhLTg1YzUtYzZjZjNjOGZjNWJhXkEyXkFqcGc@._V1_SX300.jpg",
  },
];


export default function App() {
  const [query, setQuery] = useState("");

  return (
    <>
      <NavBar query={query} setQuery={setQuery} />
      <Main query={query} />
    </>
  );
}





function NavBar({ query, setQuery }) {
  return (
    <nav className="nav-bar">
      <h1>🍿 usePopcorn</h1>

      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </nav>
  );
}


function Main({ query }) {
  const filteredMovies = tempMovies.filter((movie) =>
    movie.Title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="main">
      <Box>
        <MovieList movies={filteredMovies} />
      </Box>

      <Box>Watched List</Box>
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
      <img src={movie.Poster} alt={movie.Title} />
      <h3>{movie.Title}</h3>
      <p>{movie.Year}</p>
    </li>
  );
}
function Box({ children }) {
  return <div className="box">{children}</div>;
}


