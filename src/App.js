import { useState, useEffect } from "react";
import "./index.css";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";
import StarRating from "./StarRating";

export default function App() {
  // eslint-disable-next-line
  const [query, setQuery] = useState("");
const [selectedId, setSelectedId] = useState(null);

const { movies, isLoading, error } = useMovies(query);
const [watched, setWatched] = useLocalStorageState([], "watched");


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
  loading={isLoading}
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
  className="search"
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
  watched={watched}
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
    <ul className="list list-movies">

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

function MovieDetails({ selectedId,  watched,  onAddWatched,  onCloseMovie  }) {

  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const isWatched = watched.some(
  (movie) => movie.imdbID === selectedId
);

const watchedUserRating = watched.find(
  (movie) => movie.imdbID === selectedId
)?.userRating;

   useKey("Escape", onCloseMovie);


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
    userRating, 
  };

  onAddWatched(newWatchedMovie); 
  onCloseMovie?.();               
}


  return (
<section>
  
  

  <section className="details">
    <header>
      <button className="btn-back" onClick={onCloseMovie}>
        ←
      </button>

      <img src={movie.Poster} alt={`Poster of ${movie.Title}`} />

      <div className="details-overview">
        <h2>{movie.Title}</h2>
        <p>
          {movie.Released} • {movie.Runtime}
        </p>
        <p>{movie.Genre}</p>
        <p>⭐ {movie.imdbRating} IMDb rating</p>
        
      </div>
    </header>

    <section>
  <div className="rating">

  {!isWatched && (
    <>
      <StarRating
        maxRating={10}
        size={24}
        color="#fcc419"
        onSetRating={setUserRating}
      />

      {userRating > 0 && (
        <button className="btn-add" onClick={handleAdd}>
          + Add to list
        </button>
      )}
    </>
  )}

  {isWatched && (
    <p>You rated this movie {watchedUserRating} ⭐</p>
  )}

</div>




  <p><em>{movie.Plot}</em></p>

  <p>Starring {movie.Actors}</p>

  <p>Directed by {movie.Director}</p>

</section>

    </section>
  </section>
  
);

} 
function WatchedSummary({ watched }) {
  const avgImdbRating =
    watched.reduce((acc, cur) => acc + cur.imdbRating, 0) /
    watched.length || 0;

  const totalRuntime =
  watched.reduce((acc, cur) => acc + cur.runtime, 0);

     
  const avgUserRating =
    watched.reduce((acc, cur) => acc + cur.userRating, 0) /
    watched.length || 0;

  return (
    <div className="summary">
      <h2>MOVIES YOU WATCHED</h2>
      <div>
        <p>#️⃣ {watched.length} movies</p>
        <p>⭐ {avgImdbRating.toFixed(2)}</p>
        <p>🌟 {avgUserRating.toFixed(2)}</p>

        <p>⏳ {totalRuntime} min</p>

      </div>
    </div>
  );
}
function WatchedList({ watched, onDeleteWatched }) {
  return (
   <ul className="list list-watched">

      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.poster} alt={movie.title} />
          <h3>{movie.title}</h3>
          <div>
         <p>⭐ {movie.imdbRating}</p>
         <p>🌟 {movie.userRating}</p>
         <p>⏳ {movie.runtime} min</p>
         </div>

          <button className="btn-delete" onClick={() => onDeleteWatched(movie.imdbID)}>
            X
          </button>
        </li>
      ))}
    </ul>
  );
}
