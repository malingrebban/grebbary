import { designerSnippets } from "../../../data/designerSnippets";

interface CategoryFilterProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export default function CategoryFilter({
  selectedCategory,
  setSelectedCategory,
}: CategoryFilterProps) {
  // Get unique categories
  const categories = Array.from(
    new Set(designerSnippets.map((snippet) => snippet.category))
  );

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-black dark:text-zinc-50 mb-4">
        Categories
      </h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm transition-colors ${
            selectedCategory === null
              ? "bg-black dark:bg-zinc-50 text-white dark:text-black"
              : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          }`}
        >
          All ({designerSnippets.length})
        </button>
        {categories.map((category) => {
          const count = designerSnippets.filter(
            (snippet) => snippet.category === category
          ).length;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm transition-colors ${
                selectedCategory === category
                  ? "bg-black dark:bg-zinc-50 text-white dark:text-black"
                  : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
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
