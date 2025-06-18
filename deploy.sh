#!/bin/bash

# Build the project
echo "Building the project..."
npm run build

# Create a temporary branch for deployment
echo "Creating deployment branch..."
git checkout -b gh-pages-temp

# Remove everything except dist folder
echo "Cleaning up for deployment..."
git rm -rf .
git checkout HEAD -- dist/

# Move dist contents to root
echo "Moving build files to root..."
mv dist/* .
rmdir dist

# Add all files
git add .

# Commit the deployment
echo "Committing deployment..."
git commit -m "Deploy to GitHub Pages"

# Push to gh-pages branch
echo "Pushing to gh-pages branch..."
git push origin gh-pages-temp:gh-pages --force

# Clean up
echo "Cleaning up..."
git checkout master
git branch -D gh-pages-temp

echo "Deployment complete! Your app should be available at:"
echo "https://plastlab.github.io/scanner" 