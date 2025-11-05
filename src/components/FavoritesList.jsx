import MovieCard from "../MovieCard";

function FavoritesList({ favorites, onToggleFavorite }) {
  if (favorites.length === 0) {
    return (
      <div className="w-full max-w-7xl px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">My Favorites</h2>
        <div className="bg-white rounded-lg p-8 text-center shadow-md">
          <span className="text-6xl mb-4 block">🎬</span>
          <p className="text-gray-600 text-lg">No favorite movies yet.</p>
          <p className="text-gray-500 mt-2">Click the heart icon on any movie to add it to your favorites!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl px-4 py-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span>❤️</span>
        My Favorites ({favorites.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {favorites.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            isFavorite={true}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}

export default FavoritesList;