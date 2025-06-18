# Waste Management Scanner App

A React TypeScript application for scanning and tracking product purchases and disposals with a points system.

## Features

- User authentication system
- Product purchase scanning (camera simulation)
- Product disposal scanning with trash can validation
- Points system for proper disposal
- Fines tracking
- Responsive dashboard with user statistics

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Deployment to GitHub Pages

### Step 1: Update Configuration

Before deploying, you need to update the repository name in these files:

1. **Update `package.json`:**
   ```json
   {
     "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
   }
   ```

2. **Update `vite.config.ts`:**
   ```typescript
   base: process.env.NODE_ENV === 'production' ? '/YOUR_REPO_NAME/' : '/'
   ```

   Replace `YOUR_REPO_NAME` with your actual repository name.

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Deploy

#### Option A: Manual Deployment
```bash
npm run deploy
```

#### Option B: Automatic Deployment (Recommended)
1. Push your code to GitHub
2. The GitHub Actions workflow will automatically build and deploy to GitHub Pages
3. Go to your repository Settings → Pages
4. Set the source to "GitHub Actions"

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to "Pages" section
4. Under "Source", select "GitHub Actions"
5. Your site will be available at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

## Troubleshooting

### White Screen Issue
If you see a white screen on GitHub Pages:

1. Check that the base path in `vite.config.ts` matches your repository name
2. Ensure the `homepage` field in `package.json` is correct
3. Check the browser console for any JavaScript errors
4. Verify that the GitHub Actions workflow completed successfully

### Common Issues

1. **404 Errors**: Make sure the base path includes the trailing slash
2. **Assets not loading**: Check that all paths are relative to the base path
3. **Build failures**: Ensure all dependencies are properly installed

## Technology Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (Icons)
- React Webcam

## Project Structure

```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── types/         # TypeScript type definitions
├── App.tsx        # Main app component
├── main.tsx       # App entry point
└── index.css      # Global styles
```

## License

MIT 