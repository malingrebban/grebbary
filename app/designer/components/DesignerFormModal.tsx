import { useState, useEffect } from "react";
import Image from "next/image";
import {
  designerSnippets,
  DesignerSnippet,
} from "../../../data/designerSnippets";

interface DesignerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSnippetAdded?: (snippet: DesignerSnippet) => void;
  onSnippetUpdated?: (snippet: DesignerSnippet) => void;
  editSnippet?: DesignerSnippet | null;
}

export default function DesignerFormModal({
  isOpen,
  onClose,
  onSnippetAdded,
  onSnippetUpdated,
  editSnippet,
}: DesignerFormModalProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [newPlatform, setNewPlatform] = useState("");
  const [showNewPlatformInput, setShowNewPlatformInput] = useState(false);

  // Form state
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [figmaLink, setFigmaLink] = useState("");
  const [author, setAuthor] = useState("");
  const [brand, setBrand] = useState("");
  const [, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editSnippet) {
      setProjectName(editSnippet.projectName);
      setDescription(editSnippet.description);
      setFigmaLink(editSnippet.figmaLink || "");
      setAuthor(editSnippet.author);
      setBrand(editSnippet.brand);
      setSelectedCategory(editSnippet.category);
      setSelectedPlatform(editSnippet.platform);
      setImagePreview(editSnippet.image);
    } else {
      // Reset form for new snippet
      setProjectName("");
      setDescription("");
      setFigmaLink("");
      setAuthor("");
      setBrand("");
      setSelectedCategory("");
      setSelectedPlatform("");
      setImagePreview(null);
      setNewCategory("");
      setNewPlatform("");
      setShowNewCategoryInput(false);
      setShowNewPlatformInput(false);
    }
  }, [editSnippet, isOpen]);

  if (!isOpen) return null;

  // Get unique categories and platforms from existing data
  const existingCategories = Array.from(
    new Set(designerSnippets.map((snippet) => snippet.category))
  );
  const existingPlatforms = Array.from(
    new Set(designerSnippets.map((snippet) => snippet.platform))
  );

  const handleCategoryChange = (value: string) => {
    if (value === "new") {
      setShowNewCategoryInput(true);
      setSelectedCategory("");
    } else {
      setSelectedCategory(value);
      setShowNewCategoryInput(false);
    }
  };

  const handlePlatformChange = (value: string) => {
    if (value === "new") {
      setShowNewPlatformInput(true);
      setSelectedPlatform("");
    } else {
      setSelectedPlatform(value);
      setShowNewPlatformInput(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      setImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (
        !projectName.trim() ||
        !description.trim() ||
        !author.trim() ||
        !brand.trim()
      ) {
        alert("Please fill in all required fields");
        return;
      }

      // Determine final category and platform values
      const finalCategory = showNewCategoryInput
        ? newCategory.trim()
        : selectedCategory;
      const finalPlatform = showNewPlatformInput
        ? newPlatform.trim()
        : selectedPlatform;

      if (!finalCategory) {
        alert("Please select or create a category");
        return;
      }

      if (!finalPlatform) {
        alert("Please select or create a platform");
        return;
      }

      // Create or update snippet
      const snippetData: DesignerSnippet = {
        id: editSnippet ? editSnippet.id : Date.now().toString(), // Use existing ID for edit, generate new for create
        projectName: projectName.trim(),
        // Keep the original image data - storage will handle conversion
        image: imagePreview || "/assets/img_placeholder.png",
        category: finalCategory,
        platform: finalPlatform,
        brand: brand.trim(),
        author: author.trim(),
        description: description.trim(),
        figmaLink: figmaLink.trim() || undefined,
        createdAt: editSnippet
          ? editSnippet.createdAt
          : new Date().toISOString(), // Keep original creation date for edit
      };

      // Call the appropriate callback
      if (editSnippet && onSnippetUpdated) {
        onSnippetUpdated(snippetData);
      } else if (!editSnippet && onSnippetAdded) {
        onSnippetAdded(snippetData);
      }

      // Reset form
      setProjectName("");
      setDescription("");
      setFigmaLink("");
      setAuthor("");
      setBrand("");
      setImage(null);
      setImagePreview(null);
      setSelectedCategory("");
      setSelectedPlatform("");
      setNewCategory("");
      setNewPlatform("");
      setShowNewCategoryInput(false);
      setShowNewPlatformInput(false);

      // Close modal
      onClose();
    } catch (error) {
      console.error("Error creating snippet:", error);

      // Check if it's a quota exceeded error
      if (error instanceof Error && error.name === "QuotaExceededError") {
        alert(
          "Storage is full. Please clear some data or try again with a smaller image."
        );
      } else {
        alert("Error creating snippet. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white sm:bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full h-full sm:h-auto sm:border sm:border-zinc-200 dark:sm:border-zinc-700 sm:shadow-2xl overflow-y-auto sm:max-w-md">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-black dark:text-zinc-50">
            {editSnippet ? "Edit your design" : "Add your design"}
          </h2>
          <button
            onClick={onClose}
            className="text-black dark:text-zinc-50 border border-black dark:border-zinc-50 bg-white dark:bg-zinc-900 hover:bg-black dark:hover:bg-zinc-50 hover:text-white dark:hover:text-black transition-colors px-1.5 py-0.5 rounded text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              className="w-full px-2 py-1.5 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Description *
            </label>
            <textarea
              className="w-full px-2 py-1.5 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              rows={2}
              placeholder="Describe your design"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Author *
            </label>
            <input
              type="text"
              className="w-full px-2 py-1.5 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter your name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Brand *
            </label>
            <input
              type="text"
              className="w-full px-2 py-1.5 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter your brand/company name"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Project Image
            </label>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              Note: Large images will be replaced with a placeholder to save
              storage space.
            </p>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-2 py-1.5 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-100 dark:file:bg-zinc-700 file:text-zinc-700 dark:file:text-zinc-300 hover:file:bg-zinc-200 dark:hover:file:bg-zinc-600 text-sm"
              />
              {imagePreview && (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={400}
                    height={128}
                    className="w-full h-24 object-cover rounded-lg border border-zinc-300 dark:border-zinc-600"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Platform *
            </label>
            <select
              className="w-full px-2 py-1.5 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={selectedPlatform}
              onChange={(e) => handlePlatformChange(e.target.value)}
            >
              <option value="">Select a platform</option>
              {existingPlatforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
              <option value="new">+ Add new platform</option>
            </select>
            {showNewPlatformInput && (
              <input
                type="text"
                className="w-full px-2 py-1.5 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 text-sm"
                placeholder="Enter new platform name"
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value)}
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Category *
            </label>
            <select
              className="w-full px-2 py-1.5 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">Select a category</option>
              {existingCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="new">+ Add new category</option>
            </select>
            {showNewCategoryInput && (
              <input
                type="text"
                className="w-full px-2 py-1.5 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 text-sm"
                placeholder="Enter new category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Figma Link
            </label>
            <input
              type="url"
              className="w-full px-2 py-1.5 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="https://figma.com/file/..."
              value={figmaLink}
              onChange={(e) => setFigmaLink(e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-1.5 border border-black dark:border-zinc-50 text-black dark:text-zinc-50 bg-white dark:bg-zinc-900 rounded-lg hover:bg-black dark:hover:bg-zinc-50 hover:text-white dark:hover:text-black transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-3 py-1.5 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 border border-black dark:border-zinc-50 rounded-lg hover:bg-black dark:hover:bg-zinc-50 hover:text-white dark:hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isSubmitting
                ? editSnippet
                  ? "Updating..."
                  : "Adding..."
                : editSnippet
                ? "Update"
                : "Submit to Grebbary"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
