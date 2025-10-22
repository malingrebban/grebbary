import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { DevSnippet } from "../../../data/devSnippets";

interface SnippetCardProps {
  snippet: DevSnippet;
  onEdit?: (snippet: DevSnippet) => void;
  onDelete?: (snippet: DevSnippet) => void;
}

export default function SnippetCard({ snippet, onEdit, onDelete }: SnippetCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuAction = (action: () => void) => {
    action();
    setShowMenu(false);
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative">
      {/* 3-dot menu button */}
      <div className="absolute top-4 right-4 z-10" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-8 h-8 bg-white/80 hover:bg-white border border-zinc-200 rounded-full flex items-center justify-center hover:shadow-md transition-all"
        >
          <span className="text-zinc-600 text-lg">•••</span>
        </button>
        
        {/* Dropdown menu */}
        {showMenu && (
          <div className="absolute right-0 top-10 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 min-w-[120px] z-20">
            {onEdit && (
              <button
                onClick={() => handleMenuAction(() => onEdit(snippet))}
                className="w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => handleMenuAction(() => onDelete(snippet))}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Project Image */}
      <div className="w-full h-48 bg-zinc-100 flex items-center justify-center relative">
        <Image
          src={snippet.image}
          alt={snippet.projectName}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <div className="hidden w-full h-full flex items-center justify-center text-zinc-400">
          <div className="text-center">
            <div className="text-4xl mb-2">💻</div>
            <div className="text-sm">No Image</div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center">
            <span className="text-sm">💻</span>
          </div>
          <div>
            <h3 className="font-semibold text-black">
              {snippet.projectName}
            </h3>
            <p className="text-xs text-zinc-600 font-medium">
              {snippet.brand}
            </p>
            <p className="text-xs text-zinc-500">
              by {snippet.author}
            </p>
          </div>
        </div>
        <p className="text-sm text-zinc-600 mb-4 h-12 line-clamp-3">
          {snippet.description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-zinc-100 text-xs text-zinc-600 rounded">
              {snippet.framework}
            </span>
            <span className="px-2 py-1 bg-zinc-100 text-xs text-zinc-600 rounded">
              {snippet.category}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-zinc-500">
            {new Date(snippet.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </div>
          <a
            href={snippet.codeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            View Code →
          </a>
        </div>
      </div>
    </div>
  );
}
