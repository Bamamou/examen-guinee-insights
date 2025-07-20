#!/usr/bin/env bash
# Build script for Render.com

# Install dependencies
npm install

# Build TypeScript
npm run build

# Import data if database doesn't exist
if [ ! -f "./data/exams.db" ]; then
  echo "Database not found, importing data..."
  node reImportData.js
fi

echo "Build completed successfully!"
