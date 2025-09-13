// Simple script to load CSV data if needed
// This can be enhanced to handle CSV loading from different sources

async function loadCSVFromFile() {
  try {
    const response = await fetch('Dataset/cleaned_comments.csv');
    if (!response.ok) {
      throw new Error('Failed to load CSV file');
    }
    return await response.text();
  } catch (error) {
    console.error('Error loading CSV:', error);
    return null;
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { loadCSVFromFile };
}
