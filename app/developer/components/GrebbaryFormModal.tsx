import { useState, useEffect } from 'react';
import Image from 'next/image';
import { devSnippets, DevSnippet } from '../../../data/devSnippets';

interface GrebbaryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSnippetAdded?: (snippet: DevSnippet) => void;
  onSnippetUpdated?: (snippet: DevSnippet) => void;
  editSnippet?: DevSnippet | null;
}

export default function GrebbaryFormModal({ isOpen, onClose, onSnippetAdded, onSnippetUpdated, editSnippet }: GrebbaryFormModalProps) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState('');
  const [newFramework, setNewFramework] = useState('');
  const [showNewFrameworkInput, setShowNewFrameworkInput] = useState(false);
  
  // Form state
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [codeLink, setCodeLink] = useState('');
  const [author, setAuthor] = useState('');
  const [brand, setBrand] = useState('');
  const [, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editSnippet) {
      setProjectName(editSnippet.projectName);
      setDescription(editSnippet.description);
      setCodeLink(editSnippet.codeLink);
      setAuthor(editSnippet.author);
      setBrand(editSnippet.brand);
      setSelectedCategory(editSnippet.category);
      setSelectedFramework(editSnippet.framework);
      setImagePreview(editSnippet.image);
    } else {
      // Reset form for new snippet
      setProjectName('');
      setDescription('');
      setCodeLink('');
      setAuthor('');
      setBrand('');
      setSelectedCategory('');
      setSelectedFramework('');
      setImagePreview(null);
      setNewCategory('');
      setNewFramework('');
      setShowNewCategoryInput(false);
      setShowNewFrameworkInput(false);
    }
  }, [editSnippet, isOpen]);

  if (!isOpen) return null;

  // Get unique categories and frameworks from existing data
  const existingCategories = Array.from(new Set(devSnippets.map(snippet => snippet.category)));
  const existingFrameworks = Array.from(new Set(devSnippets.map(snippet => snippet.framework)));

  const handleCategoryChange = (value: string) => {
    if (value === 'new') {
      setShowNewCategoryInput(true);
      setSelectedCategory('');
    } else {
      setSelectedCategory(value);
      setShowNewCategoryInput(false);
    }
  };

  const handleFrameworkChange = (value: string) => {
    if (value === 'new') {
      setShowNewFrameworkInput(true);
      setSelectedFramework('');
    } else {
      setSelectedFramework(value);
      setShowNewFrameworkInput(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
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
      if (!projectName.trim() || !description.trim() || !codeLink.trim() || !author.trim() || !brand.trim()) {
        alert('Please fill in all required fields');
        return;
      }

      // Determine final category and framework values
      const finalCategory = showNewCategoryInput ? newCategory.trim() : selectedCategory;
      const finalFramework = showNewFrameworkInput ? newFramework.trim() : selectedFramework;

      if (!finalCategory) {
        alert('Please select or create a category');
        return;
      }

      if (!finalFramework) {
        alert('Please select or create a framework');
        return;
      }

      // Create or update snippet
      const snippetData: DevSnippet = {
        id: editSnippet ? editSnippet.id : Date.now().toString(), // Use existing ID for edit, generate new for create
        projectName: projectName.trim(),
        image: imagePreview || "/assets/img_placeholder.png", // Use uploaded image or placeholder
        framework: finalFramework,
        frameworkVersion: editSnippet ? editSnippet.frameworkVersion : "1.0.0", // Keep existing version for edit
        category: finalCategory,
        platform: editSnippet ? editSnippet.platform : "Web", // Keep existing platform for edit
        author: author.trim(),
        description: description.trim(),
        codeLink: codeLink.trim(),
        brand: brand.trim(),
        createdAt: editSnippet ? editSnippet.createdAt : new Date().toISOString() // Keep original creation date for edit
      };

      // Call the appropriate callback
      if (editSnippet && onSnippetUpdated) {
        onSnippetUpdated(snippetData);
      } else if (!editSnippet && onSnippetAdded) {
        onSnippetAdded(snippetData);
      }

      // Reset form
      setProjectName('');
      setDescription('');
      setCodeLink('');
      setAuthor('');
      setBrand('');
      setImage(null);
      setImagePreview(null);
      setSelectedCategory('');
      setSelectedFramework('');
      setNewCategory('');
      setNewFramework('');
      setShowNewCategoryInput(false);
      setShowNewFrameworkInput(false);

      // Close modal
      onClose();
    } catch (error) {
      console.error('Error creating snippet:', error);
      alert('Error creating snippet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white sm:bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full h-full sm:h-auto sm:border sm:border-zinc-200 sm:shadow-2xl overflow-y-auto sm:max-w-md">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-black">
            {editSnippet ? 'Edit your magic' : 'Add your magic'}
          </h2>
          <button
            onClick={onClose}
            className="text-black border border-black bg-white hover:bg-black hover:text-white transition-colors px-1.5 py-0.5 rounded text-sm"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              className="w-full px-2 py-1.5 border border-zinc-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Description *
            </label>
            <textarea
              className="w-full px-2 py-1.5 border border-zinc-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              rows={2}
              placeholder="Describe your snippet"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Author *
            </label>
            <input
              type="text"
              className="w-full px-2 py-1.5 border border-zinc-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter your name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Brand *
            </label>
            <input
              type="text"
              className="w-full px-2 py-1.5 border border-zinc-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter your brand/company name"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Project Image
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-2 py-1.5 border border-zinc-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 text-sm"
              />
              {imagePreview && (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={400}
                    height={128}
                    className="w-full h-24 object-cover rounded-lg border border-zinc-300"
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
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Framework *
            </label>
            <select 
              className="w-full px-2 py-1.5 border border-zinc-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={selectedFramework}
              onChange={(e) => handleFrameworkChange(e.target.value)}
            >
              <option value="">Select a framework</option>
              {existingFrameworks.map((framework) => (
                <option key={framework} value={framework}>
                  {framework}
                </option>
              ))}
              <option value="new">+ Add new framework</option>
            </select>
            {showNewFrameworkInput && (
              <input
                type="text"
                className="w-full px-2 py-1.5 border border-zinc-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 text-sm"
                placeholder="Enter new framework name"
                value={newFramework}
                onChange={(e) => setNewFramework(e.target.value)}
              />
            )}
          </div>
          
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Category *
            </label>
            <select 
              className="w-full px-2 py-1.5 border border-zinc-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                className="w-full px-2 py-1.5 border border-zinc-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 text-sm"
                placeholder="Enter new category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            )}
          </div>
          
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Code Link *
            </label>
            <input
              type="url"
              className="w-full px-2 py-1.5 border border-zinc-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="https://github.com/username/repo"
              value={codeLink}
              onChange={(e) => setCodeLink(e.target.value)}
              required
            />
          </div>
          
          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-1.5 border border-black text-black bg-white rounded-lg hover:bg-black hover:text-white transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-3 py-1.5 bg-white text-black border border-black rounded-lg hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isSubmitting 
                ? (editSnippet ? 'Updating...' : 'Adding...') 
                : (editSnippet ? 'Update' : 'Submit to Grebbary')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
