# Quick Deployment Guide

## Before You Start

1. **Create a GitHub repository** (if you haven't already)
2. **Note your repository name** - you'll need it for the next steps

## Step 1: Update Configuration Files

### Update `package.json`
Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual values:

```json
"homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
```

### Update `vite.config.ts`
Replace `YOUR_REPO_NAME` with your actual repository name:

```typescript
base: process.env.NODE_ENV === 'production' ? '/YOUR_REPO_NAME/' : '/'
```

## Step 2: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings"
3. Scroll down to "Pages"
4. Under "Source", select "GitHub Actions"
5. Wait for the deployment to complete

## Step 4: Access Your Site

Your site will be available at:
`https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

## Troubleshooting

- **White screen**: Check browser console for errors
- **404 errors**: Verify the base path matches your repo name
- **Build fails**: Check GitHub Actions tab for error details 