import { DevSnippet } from './devSnippets';

const STORAGE_KEY = 'grebbary-snippets';

// Get snippets from localStorage, fallback to default data
export const getSnippetsFromStorage = (): DevSnippet[] => {
  if (typeof window === 'undefined') {
    // Server-side rendering fallback
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading snippets from localStorage:', error);
  }
  
  return [];
};

// Save snippets to localStorage
export const saveSnippetsToStorage = (snippets: DevSnippet[]): void => {
  if (typeof window === 'undefined') {
    return; // Skip on server-side
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
  } catch (error) {
    console.error('Error saving snippets to localStorage:', error);
  }
};

// Add a new snippet to storage
export const addSnippetToStorage = (snippet: DevSnippet): DevSnippet[] => {
  const existingSnippets = getSnippetsFromStorage();
  const updatedSnippets = [snippet, ...existingSnippets];
  saveSnippetsToStorage(updatedSnippets);
  return updatedSnippets;
};

// Get all snippets (from localStorage + default data)
export const getAllSnippets = (defaultSnippets: DevSnippet[]): DevSnippet[] => {
  const storedSnippets = getSnippetsFromStorage();
  
  // If no stored snippets, initialize with default data
  if (storedSnippets.length === 0) {
    saveSnippetsToStorage(defaultSnippets);
    return defaultSnippets;
  }
  
  return storedSnippets;
};

// Update an existing snippet in storage
export const updateSnippetInStorage = (updatedSnippet: DevSnippet): DevSnippet[] => {
  const existingSnippets = getSnippetsFromStorage();
  const updatedSnippets = existingSnippets.map(snippet => 
    snippet.id === updatedSnippet.id ? updatedSnippet : snippet
  );
  saveSnippetsToStorage(updatedSnippets);
  return updatedSnippets;
};

// Delete a snippet from storage
export const deleteSnippetFromStorage = (snippetId: string): DevSnippet[] => {
  const existingSnippets = getSnippetsFromStorage();
  const updatedSnippets = existingSnippets.filter(snippet => snippet.id !== snippetId);
  saveSnippetsToStorage(updatedSnippets);
  return updatedSnippets;
};
