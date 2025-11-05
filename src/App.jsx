import { useState, useEffect } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";
import FavoritesList from "./components/FavoritesList";
import Footer from "./components/Footer";

const API_URL = "http://www.omdbapi.com/?i=tt3896198&apikey=45aa9a43";

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("Avengers");
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState("search");

  // ✅ Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem("movieFavorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // ✅ Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("movieFavorites", JSON.stringify(favorites));
  }, [favorites]);

  // ✅ Fetch movies from OMDb API
  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}&s=${searchTerm}`);
      const data = await response.json();
      setMovies(data.Search || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // ✅ Toggle favorite movie
  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const isFavorite = prev.some((fav) => fav.imdbID === movie.imdbID);
      if (isFavorite) {
        return prev.filter((fav) => fav.imdbID !== movie.imdbID);
      } else {
        return [...prev, movie];
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 text-gray-800">
      <Header />

      {/* ✅ Tab Navigation */}
      <div className="w-full max-w-7xl px-4 pt-4">
        <div className="flex gap-2 border-b border-gray-300">
          <button
            onClick={() => setActiveTab("search")}
            className={`px-4 sm:px-6 py-2 font-semibold transition-colors ${
              activeTab === "search"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Search Movies
          </button>

          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-4 sm:px-6 py-2 font-semibold transition-colors flex items-center gap-2 ${
              activeTab === "favorites"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            <span className="text-lg">❤️</span>
            <span className="hidden sm:inline">Favorites</span>
            <span className="sm:hidden">Fav</span>
            {favorites.length > 0 && <span>({favorites.length})</span>}
          </button>
        </div>
      </div>

      {/* ✅ Conditional Rendering for Tabs */}
      {activeTab === "search" ? (
        <>
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={fetchMovies}
          />
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <p className="text-gray-600 text-lg">Loading...</p>
            </div>
          ) : (
            <MovieList
              movies={movies}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              apiKey="45aa9a43"
            />
          )}
        </>
      ) : activeTab === "favorites" ? (
        <FavoritesList favorites={favorites} onToggleFavorite={toggleFavorite} />
      ) : (
        <Feedback /> // ✅ Display Feedback Component
      )}

      <div className="mt-10" />
      <Footer />
    </div>
  );
}

export default App;
