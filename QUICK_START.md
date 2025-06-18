# Quick Start: Build iOS .ipa Without Mac

This guide will get you building iOS .ipa files in under 10 minutes using Expo's cloud build service.

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
# Install Expo CLI and EAS CLI
npm install -g @expo/cli eas-cli

# Install project dependencies
npm install
```

### 2. Login to Expo
```bash
# Create free account at https://expo.dev if you don't have one
eas login
```

### 3. Configure Your App
Edit `app.json` and update the bundle identifier:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.plastictracker"
    }
  }
}
```

### 4. Set Up Credentials (One-time setup)
```bash
# EAS will guide you through Apple Developer setup
eas credentials --platform ios
```

### 5. Build Your .ipa File
```bash
# For testing (internal distribution)
npm run build:ios

# For TestFlight
npm run build:ios-preview

# For App Store
npm run build:ios-production
```

## 📱 What You Get

After the build completes (usually 10-15 minutes), you'll receive:
- ✅ **Direct .ipa download link**
- ✅ **QR code for easy installation**
- ✅ **Build logs and details**
- ✅ **Ready for TestFlight or direct installation**

## 🔧 Advanced Options

### Automated Build Scripts
```bash
# Linux/Mac
./scripts/build-ios.sh --profile preview

# Windows
scripts\build-ios.bat --profile preview
```

### GitHub Actions (CI/CD)
The project includes GitHub Actions workflows that automatically build on:
- Push to main branch
- Pull requests
- Manual triggers

### Environment Variables
Create `.env` file for sensitive data:
```bash
EXPO_TOKEN=your_expo_token
EXPO_APPLE_TEAM_ID=your_team_id
EXPO_APPLE_APP_SPECIFIC_PASSWORD=your_app_specific_password
```

## 🎯 Build Profiles

- **Development**: For internal testing, includes development tools
- **Preview**: For TestFlight distribution, optimized for testing
- **Production**: For App Store distribution, fully optimized

## 📋 Prerequisites

- ✅ Node.js 16+ 
- ✅ npm or yarn
- ✅ Expo account (free)
- ✅ Apple Developer account (for distribution)

## 🆘 Troubleshooting

### Build Fails?
```bash
# Check build status
eas build:list --platform ios

# View build logs
eas build:view BUILD_ID

# Retry with clean cache
eas build --platform ios --clear-cache
```

### Credential Issues?
```bash
# Clear and regenerate credentials
eas credentials --platform ios --clear
eas credentials --platform ios
```

### Need Help?
- 📖 [Complete Documentation](build-ios.md)
- 🌐 [Expo Documentation](https://docs.expo.dev/build/introduction/)
- 💬 [Expo Community](https://forums.expo.dev/)

## 🎉 Success!

You now have a complete iOS build pipeline that:
- ✅ Works on any OS (Windows, Linux, Mac)
- ✅ No Mac required
- ✅ Automated builds
- ✅ Direct .ipa downloads
- ✅ TestFlight ready
- ✅ Cost effective

**Next step**: Run `npm run build:ios` and get your first .ipa file! 