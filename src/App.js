import { useState, useEffect } from "react";


import "./index.css";



export default function App() {
  // eslint-disable-next-line

  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

   useEffect(() => {
  if (query.length < 3) {
  setMovies([]);
  setError(null);
  return;
}
 // 1️⃣

  const fetchMovies = async () => { // 2️⃣
    setLoading(true); // 3️⃣
    setError(null);   // 4️⃣

    try {             // 5️⃣
      

      const res = await fetch(
  `https://www.omdbapi.com/?s=${query}&apikey=38aa572e`
);


      const data = await res.json();

      if (data.Response === "True") {   // 6️⃣
        setMovies(data.Search);
      } else {
        setError(data.Error);
        setMovies([]);
      }
    } catch {         // 7️⃣
      setError("Something went wrong!");
      setMovies([]);
    }

    setLoading(false); // 8️⃣
  };

  fetchMovies();
}, [query]);


console.log(movies);

  return (
    <>
      <NavBar query={query} setQuery={setQuery} />
      <Main
  query={query}
  selectedId={selectedId}
  setSelectedId={setSelectedId}
  movies={movies}       // ✅ add this
  loading={loading}     // ✅ add this
  error={error}         // ✅ add this
/>

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


function Main({ query, selectedId, setSelectedId, movies, loading, error }) {

  const filteredMovies = movies; // API se aayi movies

  

  return (
    <main className="main">
      <Box>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <MovieList
          movies={filteredMovies}
          onSelectMovie={setSelectedId}
        />
      </Box>

      <Box>
  {selectedId ? (
    <MovieDetails selectedId={selectedId} />
  ) : (
    <p>Select a movie 🍿</p>
  )}
</Box>

    </main>
  );
}



function MovieList({ movies, onSelectMovie }) {
  return (
    <ul>
      {movies.map((movie) => (
        <Movie
          key={movie.imdbID}
          movie={movie}
          onSelectMovie={onSelectMovie}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={movie.Title} />
      <h3>{movie.Title}</h3>
      <p>{movie.Year}</p>
    </li>
  );
}


function Box({ children }) {
  return <div className="box">{children}</div>;
}
function MovieDetails({ selectedId }) {
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchMovie() {
      setLoading(true);

      const res = await fetch(
        `https://www.omdbapi.com/?i=${selectedId}&apikey=38aa572e`
      );
      const data = await res.json();

      setMovie(data);
      setLoading(false);
    }

    fetchMovie();
  }, [selectedId]);

  if (loading) return <p>Loading movie...</p>;

  return (
    <div className="details">
      <img src={movie.Poster} alt={movie.Title} />
      <h2>{movie.Title}</h2>
      <p>📅 {movie.Year}</p>
      <p>⏱ {movie.Runtime}</p>
      <p>⭐ IMDb: {movie.imdbRating}</p>
    </div>
  );
}



