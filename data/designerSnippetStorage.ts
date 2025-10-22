import { DesignerSnippet } from "./designerSnippets";

const STORAGE_KEY = "grebbary-designer-snippets";

// Get snippets from localStorage, fallback to default data
export const getDesignerSnippetsFromStorage = (): DesignerSnippet[] => {
  if (typeof window === "undefined") {
    // Server-side rendering fallback
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading designer snippets from localStorage:", error);
  }

  return [];
};

// Save snippets to localStorage
export const saveDesignerSnippetsToStorage = (
  snippets: DesignerSnippet[]
): void => {
  if (typeof window === "undefined") {
    return; // Skip on server-side
  }

  try {
    // Create a copy of snippets without large image data for storage
    const snippetsForStorage = snippets.map((snippet) => ({
      ...snippet,
      // Only convert base64 data URLs to placeholders, keep original asset paths
      image: snippet.image.startsWith("data:")
        ? "/assets/img_nav_design.png" // Use an existing image as placeholder
        : snippet.image,
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(snippetsForStorage));

    // Store image previews separately to avoid quota issues
    const imagePreviews: { [key: string]: string } = {};
    snippets.forEach((snippet) => {
      if (snippet.image.startsWith("data:")) {
        imagePreviews[snippet.id] = snippet.image;
      }
    });

    if (Object.keys(imagePreviews).length > 0) {
      localStorage.setItem(
        `${STORAGE_KEY}-previews`,
        JSON.stringify(imagePreviews)
      );
    }
  } catch (error) {
    console.error("Error saving designer snippets to localStorage:", error);
    // If still failing, try to clear some space and retry
    try {
      // Clear old data and try again with smaller payload
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(`${STORAGE_KEY}-previews`);
      const snippetsForStorage = snippets.map((snippet) => ({
        ...snippet,
        image: "/assets/img_nav_design.png", // Force placeholder for all images
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snippetsForStorage));
    } catch (retryError) {
      console.error("Failed to save even with reduced data:", retryError);
    }
  }
};

// Add a new snippet to storage
export const addDesignerSnippetToStorage = (
  snippet: DesignerSnippet
): DesignerSnippet[] => {
  const existingSnippets = getDesignerSnippetsFromStorage();
  const updatedSnippets = [snippet, ...existingSnippets];
  saveDesignerSnippetsToStorage(updatedSnippets);
  return updatedSnippets;
};

// Get image previews from localStorage
export const getImagePreviews = (): { [key: string]: string } => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}-previews`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading image previews from localStorage:", error);
  }

  return {};
};

// Get all snippets (from localStorage + default data)
export const getAllDesignerSnippets = (
  defaultSnippets: DesignerSnippet[]
): DesignerSnippet[] => {
  const storedSnippets = getDesignerSnippetsFromStorage();
  const imagePreviews = getImagePreviews();

  // If no stored snippets, initialize with default data
  if (storedSnippets.length === 0) {
    saveDesignerSnippetsToStorage(defaultSnippets);
    return defaultSnippets;
  }

  // Restore image previews for snippets that have them, but keep original paths for others
  const snippetsWithPreviews = storedSnippets.map((snippet) => ({
    ...snippet,
    // Only use preview if it exists, otherwise keep the original image path
    image: imagePreviews[snippet.id] || snippet.image,
  }));

  return snippetsWithPreviews;
};

// Update an existing snippet in storage
export const updateDesignerSnippetInStorage = (
  updatedSnippet: DesignerSnippet
): DesignerSnippet[] => {
  const existingSnippets = getDesignerSnippetsFromStorage();
  const updatedSnippets = existingSnippets.map((snippet) =>
    snippet.id === updatedSnippet.id ? updatedSnippet : snippet
  );
  saveDesignerSnippetsToStorage(updatedSnippets);
  return updatedSnippets;
};

// Delete a snippet from storage
export const deleteDesignerSnippetFromStorage = (
  snippetId: string
): DesignerSnippet[] => {
  const existingSnippets = getDesignerSnippetsFromStorage();
  const updatedSnippets = existingSnippets.filter(
    (snippet) => snippet.id !== snippetId
  );
  saveDesignerSnippetsToStorage(updatedSnippets);
  return updatedSnippets;
};

// Force reset to default data (useful for debugging)
export const resetDesignerSnippetsToDefault = (
  defaultSnippets: DesignerSnippet[]
): DesignerSnippet[] => {
  if (typeof window === "undefined") {
    return defaultSnippets;
  }

  try {
    // Clear all designer-related localStorage
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(`${STORAGE_KEY}-previews`);

    // Save default snippets
    saveDesignerSnippetsToStorage(defaultSnippets);

    console.log("✅ Reset designer snippets to default data");
    return defaultSnippets;
  } catch (error) {
    console.error("Error resetting designer snippets:", error);
    return defaultSnippets;
  }
};

// Get localStorage usage info
export const getLocalStorageUsage = (): {
  used: number;
  total: number;
  percentage: number;
} => {
  if (typeof window === "undefined") {
    return { used: 0, total: 0, percentage: 0 };
  }

  let used = 0;
  let total = 0;

  try {
    // Calculate used space
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length;
      }
    }

    // Estimate total available (most browsers have ~5-10MB limit)
    total = 5 * 1024 * 1024; // 5MB estimate
  } catch (error) {
    console.error("Error calculating localStorage usage:", error);
  }

  return {
    used,
    total,
    percentage: total > 0 ? (used / total) * 100 : 0,
  };
};
