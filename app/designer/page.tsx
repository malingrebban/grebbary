"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { designerSnippets, DesignerSnippet } from "../../data/designerSnippets";
import {
  getAllDesignerSnippets,
  addDesignerSnippetToStorage,
  updateDesignerSnippetInStorage,
  deleteDesignerSnippetFromStorage,
  resetDesignerSnippetsToDefault,
} from "../../data/designerSnippetStorage";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
import DesignerSnippetCard from "./components/DesignerSnippetCard";
import DesignerFormModal from "./components/DesignerFormModal";

export default function DesignerPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<DesignerSnippet | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [snippets, setSnippets] = useState<DesignerSnippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    // Save designer role to localStorage
    localStorage.setItem("grebbary-role", "designer");

    // Load snippets from localStorage (with fallback to default data)
    const loadSnippets = () => {
      // Check if we have corrupted data and reset if needed
      const stored = localStorage.getItem("grebbary-designer-snippets");
      if (stored && stored.includes("img_placeholder.png")) {
        console.log("🔄 Detected corrupted data, resetting to default...");
        const loadedSnippets = resetDesignerSnippetsToDefault(designerSnippets);
        setSnippets(loadedSnippets);
      } else {
        const loadedSnippets = getAllDesignerSnippets(designerSnippets);
        setSnippets(loadedSnippets);
      }
      setIsLoading(false);
    };

    // Use setTimeout to avoid synchronous setState in effect
    const timeoutId = setTimeout(loadSnippets, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality is now handled by the filteredSnippets logic
    console.log("Searching for:", searchQuery);
  };

  const handleSnippetAdded = (newSnippet: DesignerSnippet) => {
    // Save to localStorage and update state
    const updatedSnippets = addDesignerSnippetToStorage(newSnippet);
    setSnippets(updatedSnippets);
  };

  const handleSnippetUpdated = (updatedSnippet: DesignerSnippet) => {
    // Update snippet in localStorage and update state
    const updatedSnippets = updateDesignerSnippetInStorage(updatedSnippet);
    setSnippets(updatedSnippets);
    setShowEditForm(false);
    setEditingSnippet(null);
  };

  const handleEditSnippet = (snippet: DesignerSnippet) => {
    setEditingSnippet(snippet);
    setShowEditForm(true);
  };

  const handleDeleteSnippet = (snippet: DesignerSnippet) => {
    if (confirm(`Are you sure you want to delete "${snippet.projectName}"?`)) {
      // Delete snippet from localStorage and update state
      const updatedSnippets = deleteDesignerSnippetFromStorage(snippet.id);
      setSnippets(updatedSnippets);
    }
  };

  // Filter snippets based on selected category and search query
  const filteredSnippets = snippets
    .filter((snippet) => {
      const matchesCategory =
        !selectedCategory || snippet.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        snippet.projectName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.projectName.localeCompare(b.projectName);
      } else {
        return b.projectName.localeCompare(a.projectName);
      }
    });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/")}
                className="text-2xl font-bold text-black dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
              >
                Grebbary
              </button>
              <div className="flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  🎨 Designer
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("grebbary-role");
                router.push("/");
              }}
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              Change Role
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Section */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
        />

        {/* Categories/Filter Section */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Create Snippet Button */}
        <div className="flex justify-between items-center mb-8 mt-12">
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 border border-black dark:border-zinc-50 rounded-lg hover:bg-black dark:hover:bg-zinc-50 hover:text-white dark:hover:text-black transition-colors font-medium"
          >
            + Add to Grebbary
          </button>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-6 py-3 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 border border-black dark:border-zinc-50 rounded-lg hover:bg-black dark:hover:bg-zinc-50 hover:text-white dark:hover:text-black transition-colors font-medium"
          >
            {sortOrder === "asc" ? "A-Z ↓" : "Z-A ↑"}
          </button>
        </div>

        {/* Snippets Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-2">
              Loading designs...
            </h3>
          </div>
        ) : filteredSnippets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-2">
              No designs found
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              {searchQuery && selectedCategory
                ? `No designs found matching "${searchQuery}" in the "${selectedCategory}" category.`
                : searchQuery
                ? `No designs found matching "${searchQuery}".`
                : selectedCategory
                ? `No designs found in the "${selectedCategory}" category.`
                : "No designs available."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSnippets.map((snippet) => (
              <DesignerSnippetCard
                key={snippet.id}
                snippet={snippet}
                onEdit={handleEditSnippet}
                onDelete={handleDeleteSnippet}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Snippet Modal */}
      <DesignerFormModal
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSnippetAdded={handleSnippetAdded}
      />

      {/* Edit Snippet Modal */}
      <DesignerFormModal
        isOpen={showEditForm}
        onClose={() => {
          setShowEditForm(false);
          setEditingSnippet(null);
        }}
        onSnippetUpdated={handleSnippetUpdated}
        editSnippet={editingSnippet}
      />
      {/* Footer */}
      <footer className="bg-zinc-50 border-t border-zinc-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sm text-zinc-600">
              © 2025 Grebbary. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
