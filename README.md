# Plastic Tracker - Web App

A React-based web application for tracking plastic waste disposal and earning points for eco-friendly behavior.

## 🎯 What This Project Provides

✅ **Web-Based Plastic Tracking** - Track your plastic waste disposal  
✅ **Points System** - Earn points for proper disposal  
✅ **Modern UI** - Beautiful, responsive design  
✅ **GitHub Pages Ready** - Deploy directly to GitHub Pages  
✅ **Camera Integration** - Scan products and enter bin codes  
✅ **Dashboard** - View your eco score and statistics  

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Deploy to GitHub Pages
```bash
npm run build
# Then push the dist/ folder to GitHub Pages
```

## 📱 App Features

This Plastic Tracker app includes:

- **Dashboard** - Track points, scans, fines, and eco score
- **Camera Scanner** - Real camera integration for product scanning
- **Bin Code Input** - Manual entry for trash bin codes (L520RE)
- **Points System** - Earn points for proper disposal
- **Modern UI** - Beautiful, responsive design

## 🛠️ Development

### Local Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Testing the App
1. **Dashboard**: View stats and navigation
2. **Disposal Scanner**: 
   - Click "Open Camera & Scan Product"
   - Camera will open (simulated scan)
   - Enter bin code "L520RE"
   - Earn points for proper disposal

## 📋 Project Structure

```
project/
├── src/
│   ├── App.tsx              # Main React app
│   ├── main.tsx             # App entry point
│   ├── components/          # React components
│   ├── hooks/               # Custom React hooks
│   └── types/               # TypeScript types
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## 🌐 Deployment

### GitHub Pages
1. Build the project: `npm run build`
2. Push the `dist/` folder to your GitHub repository
3. Enable GitHub Pages in your repository settings
4. Your app will be available at `https://yourusername.github.io/your-repo-name`

### Other Platforms
- **Vercel**: Connect your GitHub repo for automatic deployment
- **Netlify**: Drag and drop the `dist/` folder
- **Any Static Hosting**: Upload the `dist/` folder contents

## 🎉 Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern React** - Built with React 18 and TypeScript
- **Fast Builds** - Powered by Vite for quick development
- **Clean Code** - ESLint configured for code quality
- **Type Safety** - Full TypeScript support

## 📄 License

MIT License - feel free to use this project for your own plastic tracking needs! 