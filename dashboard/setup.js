const fs = require('fs');
const path = require('path');

console.log('Setting up Video Engagement Analytics Dashboard...');

// Ensure public directory exists
const publicDir = './public';
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('Created public directory');
}

// Copy CSV files
const sourceDir = './Dataset';
const filesToCopy = ['cleaned_comments.csv', 'comments.csv'];

filesToCopy.forEach(fileName => {
  const sourcePath = path.join(sourceDir, fileName);
  const targetPath = path.join(publicDir, fileName);
  
  if (fs.existsSync(sourcePath)) {
    try {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✓ Copied ${fileName} to public directory`);
    } catch (error) {
      console.error(`✗ Error copying ${fileName}:`, error.message);
    }
  } else {
    console.warn(`⚠ Warning: ${fileName} not found in Dataset directory`);
  }
});

console.log('Setup completed! You can now run: npm run dev');
