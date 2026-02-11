import { useState, useEffect } from "react";


import "./index.css";



export default function App() {
  // eslint-disable-next-line

  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useState(() => {
  return JSON.parse(localStorage.getItem("watched")) || [];
});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 function handleAddWatched(movie) {
  setWatched((watched) => {
    if (watched.some((m) => m.imdbID === movie.imdbID))
      return watched;

    return [...watched, movie];
  });
}
function handleSelectMovie(id) {
  setSelectedId((currentId) =>
    currentId === id ? null : id
  );
}


function handleDeleteWatched(id) {
  setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
}
useEffect(() => {
  localStorage.setItem("watched", JSON.stringify(watched));
}, [watched]);




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


  return (
    <>
      <NavBar 
  query={query} 
  setQuery={setQuery} 
  movies={movies} 
/>

      <Main
  query={query}
  selectedId={selectedId}
  setSelectedId={setSelectedId}
  movies={movies}
  loading={loading}
  error={error}
  watched={watched}
  onAddWatched={handleAddWatched}
  onDeleteWatched={handleDeleteWatched}
  onSelectMovie={handleSelectMovie}
/>

    </>
  );
}
function NavBar({ query, setQuery, movies }) {

  return (
    <nav className="nav-bar">
      <h1>🍿 usePopcorn</h1>

      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <p className="num-results">
  Found {movies.length} results
</p>

    </nav>
  );
}
function Main({
  query,
  selectedId,
  setSelectedId,
  movies,
  loading,
  error,
  watched,
  onAddWatched,
  onDeleteWatched,
  onSelectMovie,
})
 {
  const filteredMovies = movies; // API se aayi movies

  return (
    <main className="main">
      {/* Left side: Movie list */}
      <Box>
        {loading && <div className="loader">Loading...</div>}

        {/* Error dikhao sirf agar query >=3 aur movies empty ho */}
        {query.length >= 3 && movies.length === 0 && error && (
          <div className="error">{error}</div>
        )}

       <MovieList movies={filteredMovies} onSelectMovie={onSelectMovie} />


      </Box>

      {/* Right side: Movie details / Watched list */}
      <Box>
        {selectedId ? (
          <MovieDetails
            selectedId={selectedId}
            onAddWatched={onAddWatched}
            onCloseMovie={() => setSelectedId(null)}
          />
        ) : (
          <>
            <WatchedSummary watched={watched} />
            <WatchedList watched={watched} onDeleteWatched={onDeleteWatched} />
          </>
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
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "−" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}

function MovieDetails({ selectedId, onAddWatched,  onCloseMovie  }) {

  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(false);
useEffect(() => {
  function handleEsc(e) {
    if (e.key === "Escape") {
      onCloseMovie();
    }
  }

  document.addEventListener("keydown", handleEsc);

  return () => {
    document.removeEventListener("keydown", handleEsc);
  };
}, [onCloseMovie]);

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
function handleAdd() {
  const newWatchedMovie = {
    imdbID: movie.imdbID,
    title: movie.Title,
    year: movie.Year,
    poster: movie.Poster,
    imdbRating: Number(movie.imdbRating),
    runtime: Number(movie.Runtime?.split(" ")[0]),
    userRating, // ⭐ add this
  };

  onAddWatched(newWatchedMovie); // Watched list update
  onCloseMovie?.();               // Movie details automatically close
}


  return (
  <div className="details-overview">
    <button className="btn-back" onClick={onCloseMovie}>
  ←
</button>
  <img src={movie.Poster} alt={movie.Title} />
  <div>
    <h2>{movie.Title}</h2>
    <p>📅 {movie.Year}</p>
    <p>⏱ {movie.Runtime}</p>
    <p>⭐ IMDb: {movie.imdbRating}</p>
    <p>🎬 Genre: {movie.Genre}</p>
    <p>🎬 Director: {movie.Director}</p>
    <p>👥 Actors: {movie.Actors}</p>
    <p>📝 Plot: {movie.Plot}</p>
    <StarRating maxRating={10} onSetRating={setUserRating} />

   {userRating > 0 && (
  <button className="btn-add" onClick={handleAdd}>
    + Add to watched
  </button>
)}

  </div>
</div>

        );
} 
function WatchedSummary({ watched }) {
  const avgImdbRating =
    watched.reduce((acc, cur) => acc + cur.imdbRating, 0) /
    watched.length || 0;

  const avgRuntime =
    watched.reduce((acc, cur) => acc + cur.runtime, 0) /
    watched.length || 0;
     
  const avgUserRating =
    watched.reduce((acc, cur) => acc + cur.userRating, 0) /
    watched.length || 0;

  return (
    <div className="summary">
      <h2>MOVIES YOU WATCHED</h2>
      <div>
        <p>🎬 {watched.length} movies</p>
        <p>⭐ {avgImdbRating.toFixed(1)}</p>
        <p>🌟 {avgUserRating.toFixed(1)}</p>
        <p>⏱ {avgRuntime.toFixed(0)} min</p>
      </div>
    </div>
  );
}
function WatchedList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.poster} alt={movie.title} />
          <h3>{movie.title}</h3>
          <div>
            <p>⭐ {movie.imdbRating}</p>
            <p>⏱ {movie.runtime} min</p>
          </div>
          <button className="btn-delete" onClick={() => onDeleteWatched(movie.imdbID)}>
            X
          </button>
        </li>
      ))}
    </ul>
  );
}
function StarRating({ maxRating = 10, onSetRating }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  function handleClick(value) {
    setRating(value);
    onSetRating(value);
  }

  return (
    <div style={{ display: "flex", gap: "5px" }}>
      {Array.from({ length: maxRating }, (_, i) => (
        <span
          key={i}
          style={{
            cursor: "pointer",
            fontSize: "20px",
            color: i < (hover || rating) ? "gold" : "gray",
          }}
          onClick={() => handleClick(i + 1)}
          onMouseEnter={() => setHover(i + 1)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </span>
      ))}
      <span style={{ marginLeft: "10px" }}>{rating || ""}</span>
    </div>
  );
}
