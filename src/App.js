import './App.css';

function App() {
  return (
    <div>
       <NavBar />
      App
    </div>
  );
}

export default App;
function NavBar() {
  return (
    <nav>
      <h1>🍿 usePopcorn</h1>

      <input
        type="text"
        placeholder="Search movies..."
      />
    </nav>
  );
}

