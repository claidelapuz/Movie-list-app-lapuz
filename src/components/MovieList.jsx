import { useEffect, useState } from "react";
import MovieCard from "../MovieCard";

function MovieList({ movies, favorites, onToggleFavorite, apiKey }) {
  const [detailedMovies, setDetailedMovies] = useState([]);

  useEffect(() => {
    const fetchDetailedMovies = async () => {
      if (movies.length === 0) {
        setDetailedMovies([]);
        return;
      }

      const detailedData = await Promise.all(
        movies.map(async (movie) => {
          try {
            const response = await fetch(
              `https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`
            );
            const data = await response.json();
            return data;
          } catch (error) {
            console.error("Error fetching movie details:", error);
            return movie;
          }
        })
      );

      setDetailedMovies(detailedData);
    };

    fetchDetailedMovies();
  }, [movies, apiKey]);

  if (movies.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-gray-600 text-lg">No movies found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 w-full max-w-7xl">
      {detailedMovies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          isFavorite={favorites.some((fav) => fav.imdbID === movie.imdbID)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}

export default MovieList;
