import { devSnippets } from "../../../data/devSnippets";

interface CategoryFilterProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export default function CategoryFilter({ selectedCategory, setSelectedCategory }: CategoryFilterProps) {
  // Get unique categories
  const categories = Array.from(new Set(devSnippets.map(snippet => snippet.category)));

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-black mb-4">
        Categories
      </h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 border border-black rounded-lg text-sm transition-colors ${
            selectedCategory === null
              ? "bg-black text-white"
              : "bg-white text-black hover:bg-black hover:text-white"
          }`}
        >
          All ({devSnippets.length})
        </button>
        {categories.map((category) => {
          const count = devSnippets.filter(snippet => snippet.category === category).length;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 border border-black rounded-lg text-sm transition-colors ${
                selectedCategory === category
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-black hover:text-white"
              }`}
            >
              {category} ({count})
            </button>
          );
        })}
      </div>
    </div>
  );
}
