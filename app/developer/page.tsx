"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { devSnippets, DevSnippet } from "../../data/devSnippets";
import { getAllSnippets, addSnippetToStorage, updateSnippetInStorage, deleteSnippetFromStorage } from "../../data/snippetStorage";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
import SnippetCard from "./components/SnippetCard";
import GrebbaryFormModal from "./components/GrebbaryFormModal";

export default function DeveloperPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<DevSnippet | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [snippets, setSnippets] = useState<DevSnippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    // Save developer role to localStorage
    localStorage.setItem("grebbary-role", "developer");
    
    // Load snippets from localStorage (with fallback to default data)
    const loadSnippets = () => {
      const loadedSnippets = getAllSnippets(devSnippets);
      setSnippets(loadedSnippets);
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

  const handleSnippetAdded = (newSnippet: DevSnippet) => {
    // Save to localStorage and update state
    const updatedSnippets = addSnippetToStorage(newSnippet);
    setSnippets(updatedSnippets);
  };

  const handleSnippetUpdated = (updatedSnippet: DevSnippet) => {
    // Update snippet in localStorage and update state
    const updatedSnippets = updateSnippetInStorage(updatedSnippet);
    setSnippets(updatedSnippets);
    setShowEditForm(false);
    setEditingSnippet(null);
  };

  const handleEditSnippet = (snippet: DevSnippet) => {
    setEditingSnippet(snippet);
    setShowEditForm(true);
  };

  const handleDeleteSnippet = (snippet: DevSnippet) => {
    if (confirm(`Are you sure you want to delete "${snippet.projectName}"?`)) {
      // Delete snippet from localStorage and update state
      const updatedSnippets = deleteSnippetFromStorage(snippet.id);
      setSnippets(updatedSnippets);
    }
  };

  // Filter snippets based on selected category and search query
  const filteredSnippets = snippets.filter(snippet => {
    const matchesCategory = !selectedCategory || snippet.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      snippet.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort filtered snippets A-Z by project name
  const sortedSnippets = [...filteredSnippets].sort((a, b) => {
    const nameA = a.projectName.toLowerCase();
    const nameB = b.projectName.toLowerCase();
    return sortOrder === 'asc' 
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/")}
                className="text-2xl font-bold text-black hover:text-zinc-600 transition-colors"
              >
                Grebbary
              </button>
              <div className="flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-full">
                <span className="text-sm text-zinc-600">
                  💻 Developer
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("grebbary-role");
                router.push("/");
              }}
              className="text-sm text-black border border-black bg-white hover:bg-black hover:text-white transition-colors px-3 py-1 rounded"
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

        {/* Create Snippet Button and Sort Button */}
        <div className="mb-8 mt-12 flex items-center justify-between">
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-white text-black border border-black rounded-lg hover:bg-black hover:text-white transition-colors font-medium"
          >
            + Add to Grebbary
          </button>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-6 py-3 bg-white text-black border border-black rounded-lg hover:bg-black hover:text-white transition-colors font-medium flex items-center gap-2"
          >
            <span>{sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
            <span className="text-sm">
              {sortOrder === 'asc' ? '↑' : '↓'}
            </span>
          </button>
        </div>

        {/* Snippets Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <h3 className="text-lg font-semibold text-black mb-2">
              Loading snippets...
            </h3>
          </div>
        ) : sortedSnippets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-black mb-2">
              No snippets found
            </h3>
            <p className="text-zinc-600">
              {searchQuery && selectedCategory 
                ? `No snippets found matching "${searchQuery}" in the "${selectedCategory}" category.`
                : searchQuery 
                ? `No snippets found matching "${searchQuery}".`
                : selectedCategory 
                ? `No snippets found in the "${selectedCategory}" category.`
                : "No snippets available."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSnippets.map((snippet) => (
              <SnippetCard 
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
      <GrebbaryFormModal 
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSnippetAdded={handleSnippetAdded}
      />

      {/* Edit Snippet Modal */}
      <GrebbaryFormModal 
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
