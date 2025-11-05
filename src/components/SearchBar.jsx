import { useState } from "react";
import { Search } from "lucide-react";

function SearchBar({ searchTerm, setSearchTerm, onSearch }) {
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    await onSearch();
    setLoading(false);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 my-6 px-4 w-full">
      <div className="relative w-full sm:w-2/3 lg:w-1/2">
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pr-12 rounded-full 
                     bg-[#1e1e2f] text-gray-100 placeholder-gray-400 
                     border border-indigo-400/40 focus:ring-2 focus:ring-indigo-400 
                     focus:outline-none shadow-md shadow-indigo-400/10 
                     transition-all duration-300"
        />
        <Search
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-300"
          size={22}
        />
      </div>

      <button
        onClick={handleSearch}
        disabled={loading}
        className={`flex items-center justify-center gap-2 
                    bg-indigo-500 hover:bg-indigo-400 
                    text-white font-semibold px-6 py-3 rounded-full 
                    transition-all duration-300 
                    shadow-lg shadow-indigo-500/30 hover:shadow-indigo-400/50 
                    active:scale-95 disabled:opacity-70`}
      >
        {loading ? (
          <>
            <span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
            <span>Searching...</span>
          </>
        ) : (
          <>
            <Search size={18} /> <span>Search</span>
          </>
        )}
      </button>
    </div>
  );
}

export default SearchBar;
