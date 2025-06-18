@echo off
echo Building the project...
npm run build

echo Creating deployment branch...
git checkout -b gh-pages-temp

echo Cleaning up for deployment...
git rm -rf .
git checkout HEAD -- dist/

echo Moving build files to root...
move dist\* .
rmdir dist

echo Adding all files...
git add .

echo Committing deployment...
git commit -m "Deploy to GitHub Pages"

echo Pushing to gh-pages branch...
git push origin gh-pages-temp:gh-pages --force

echo Cleaning up...
git checkout master
git branch -D gh-pages-temp

echo Deployment complete! Your app should be available at:
echo https://plastlab.github.io/scanner
pause 