import { useState, useEffect } from "react";

function MovieCard({ movie, isFavorite, onToggleFavorite }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);

  // ✅ Feedback states
  const [feedback, setFeedback] = useState("");
  const [savedFeedback, setSavedFeedback] = useState("");
  const [showFeedbackBox, setShowFeedbackBox] = useState(false);

  // Load saved feedback (from localStorage)
  useEffect(() => {
    const storedFeedback = localStorage.getItem(`feedback_${movie.imdbID}`);
    if (storedFeedback) {
      setSavedFeedback(storedFeedback);
    }
  }, [movie.imdbID]);

  const handleFeedbackSubmit = () => {
    if (feedback.trim() === "") return;
    localStorage.setItem(`feedback_${movie.imdbID}`, feedback);
    setSavedFeedback(feedback);
    setFeedback("");
    setShowFeedbackBox(false);
  };

  // 🗑 Delete Feedback with confirmation
  const handleDeleteFeedback = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your feedback?"
    );
    if (confirmDelete) {
      localStorage.removeItem(`feedback_${movie.imdbID}`);
      setSavedFeedback("");
    }
  };

  // 🎬 Trailer Fetching Logic
  const fetchTrailer = async () => {
    setIsLoadingTrailer(true);
    try {
      const searchQuery = `${movie.Title} ${movie.Year} official trailer`;
      const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
      const proxyUrl = "https://corsproxy.io/?";
      const targetUrl = encodeURIComponent(youtubeSearchUrl);
      const response = await fetch(proxyUrl + targetUrl);
      const html = await response.text();
      const videoIdMatch = html.match(/"videoId":"([^"]+)"/);

      if (videoIdMatch && videoIdMatch[1]) {
        setTrailerKey(videoIdMatch[1]);
        setShowTrailer(true);
        setIsLoadingTrailer(false);
        return;
      }

      const invidiousResponse = await fetch(
        `https://invidious.io.lol/api/v1/search?q=${encodeURIComponent(searchQuery)}&type=video`
      );
      const invidiousData = await invidiousResponse.json();

      if (invidiousData && invidiousData.length > 0) {
        setTrailerKey(invidiousData[0].videoId);
        setShowTrailer(true);
      } else {
        throw new Error("No trailer found");
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
      const searchQuery = encodeURIComponent(`${movie.Title} ${movie.Year} official trailer`);
      window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, "_blank");
    }
    setIsLoadingTrailer(false);
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
    setTrailerKey(null);
  };

  // Pick badge color based on rating value
  const getRatingColor = (rating) => {
    const num = parseFloat(rating);
    if (num >= 8.5) return "bg-green-500";
    if (num >= 7.5) return "bg-yellow-400";
    return "bg-red-500";
  };

  return (
    <div
      className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-800 rounded-3xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.8)] 
      hover:shadow-[0_10px_40px_rgba(255,215,0,0.2)] transform hover:scale-[1.04] transition-all duration-500 group"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {/* Movie Poster */}
      <div className="relative w-full" style={{ paddingTop: "150%" }}>
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450"}
          alt={movie.Title}
          className="absolute top-0 left-0 w-full h-full object-cover rounded-t-3xl transition-all duration-500 group-hover:brightness-75 group-hover:scale-105"
        />

        {/* ⭐ IMDb Rating Badge */}
        {movie.imdbRating && (
          <div
            className={`absolute top-2 right-2 ${getRatingColor(
              movie.imdbRating
            )} text-white text-sm font-bold px-2 py-1 rounded-lg shadow-md flex items-center gap-1`}
          >
            ⭐ {movie.imdbRating}
          </div>
        )}

        {/* Gradient Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent rounded-t-3xl 
          transition-opacity duration-500 ${showDetails ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"}`}
        >
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-sm">
            <h2 className="font-bold text-lg mb-2 tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              {movie.Title}
            </h2>
            <p className="text-gray-300 italic text-xs line-clamp-3 mb-3">
              {movie.Plot || "An unforgettable cinematic experience."}
            </p>

            <div className="text-xs space-y-1">
              <p>
                <span className="text-yellow-400 font-semibold">🎭 Genre:</span>{" "}
                {movie.Genre || movie.Type}
              </p>
              <p>
                <span className="text-yellow-400 font-semibold">⏱ Duration:</span>{" "}
                {movie.Runtime || movie.Year}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-3 flex flex-col gap-2">
              <button
                onClick={fetchTrailer}
                disabled={isLoadingTrailer}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 rounded-xl flex items-center justify-center gap-2 
                transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg"
              >
                🎬 {isLoadingTrailer ? "Loading..." : "Watch Trailer"}
              </button>

              <button
                onClick={() => onToggleFavorite(movie)}
                className={`w-full py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                  isFavorite
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-md"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
              >
                {isFavorite ? "❤️ Favorited" : "🤍 Add to Favorites"}
              </button>

              {/* 💬 Feedback Button */}
              <button
                onClick={() => setShowFeedbackBox(!showFeedbackBox)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-xl transition-all duration-300"
              >
                {showFeedbackBox ? "Cancel Feedback" : "💬 Leave Feedback"}
              </button>
            </div>

            {/* Feedback Box */}
            {showFeedbackBox && (
              <div className="mt-3 bg-gray-800/60 p-3 rounded-xl">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Write your feedback..."
                  className="w-full border border-gray-600 rounded-lg p-2 text-sm text-white bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={handleFeedbackSubmit}
                  className="mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1 rounded-lg text-sm transition"
                >
                  Submit
                </button>
              </div>
            )}

            {/* Display Saved Feedback */}
            {savedFeedback && (
              <div className="mt-3 bg-black/30 border-t border-gray-600 pt-2 rounded-b-2xl">
                <p className="text-sm text-gray-200">
                  💬 <span className="font-semibold">Your feedback:</span> {savedFeedback}
                </p>
                <button
                  onClick={handleDeleteFeedback}
                  className="mt-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded-lg text-sm transition"
                >
                   Delete 
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 text-white bg-gradient-to-r from-gray-900 via-gray-800 to-black">
        <h2 className="font-semibold text-base sm:text-lg line-clamp-2">{movie.Title}</h2>
        <p className="text-xs sm:text-sm text-gray-400">{movie.Year}</p>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailerKey && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={handleCloseTrailer}
        >
          <div
            className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseTrailer}
              className="absolute -top-10 right-0 text-white text-4xl hover:text-red-500 transition-colors"
            >
              ✕
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="rounded-2xl"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieCard;
  