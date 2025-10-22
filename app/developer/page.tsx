"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DeveloperPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Save developer role to localStorage
    localStorage.setItem("grebbary-role", "developer");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

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
                Grebarry
              </button>
              <div className="flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  💻 Developer
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-2">
            Developer Snippets
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Search and explore code snippets from the Grebban team.
          </p>

          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search code snippets..."
                className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-black dark:bg-zinc-50 text-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors font-medium"
            >
              Search
            </button>
          </form>
        </div>

        {/* Categories/Filter Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-black dark:text-zinc-50 mb-4">
            Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              React Components
            </button>
            <button className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              Animations
            </button>
            <button className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              Utilities
            </button>
            <button className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              Hooks
            </button>
          </div>
        </div>

        {/* Snippets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder snippets */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                  <span className="text-sm">💻</span>
                </div>
                <div>
                  <h3 className="font-semibold text-black dark:text-zinc-50">
                    Sample Component {index + 1}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    by @username
                  </p>
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                A sample code snippet for demonstration purposes.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 rounded">
                    React
                  </span>
                  <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 rounded">
                    Tailwind
                  </span>
                </div>
                <button className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                  View →
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
