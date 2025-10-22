interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery, onSearch }: SearchBarProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-black mb-2">
        Shared by developers
      </h1>
      <p className="text-zinc-600 mb-6">
        Search and explore code snippets from the Grebban team.
      </p>

      <form onSubmit={onSearch} className="flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code snippets by project name..."
            className="w-full px-4 py-3 border border-zinc-200 rounded-lg bg-white text-black placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-white text-black border border-black rounded-lg hover:bg-black hover:text-white transition-colors font-medium"
        >
          Search
        </button>
      </form>
    </div>
  );
}
