import "./index.css";

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
      <div className="box">Movie List</div>
      <div className="box">Watched List</div>
    </main>
  );
}
