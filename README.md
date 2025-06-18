# Plastic Tracker - iOS Build Solution

A complete React Native Expo project with automated iOS .ipa build capabilities that work without requiring a Mac.

## 🎯 What This Project Provides

✅ **Complete iOS Build Pipeline** - Generate .ipa files without a Mac  
✅ **Automated Build Scripts** - One-command builds for all platforms  
✅ **CI/CD Integration** - GitHub Actions workflows included  
✅ **Multiple Build Profiles** - Development, preview, and production builds  
✅ **Direct Download Links** - Get .ipa files immediately after build  
✅ **TestFlight Ready** - Automatic submission capabilities  
✅ **Cost Effective** - Free tier available, pay-per-build pricing  

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install -g @expo/cli eas-cli
npm install
```

### 2. Login to Expo
```bash
eas login
```

### 3. Configure Your App
Update `app.json` with your bundle identifier:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.plastictracker"
    }
  }
}
```

### 4. Set Up Credentials
```bash
eas credentials --platform ios
```

### 5. Build Your .ipa File
```bash
npm run build:ios
```

**That's it!** Your .ipa file will be ready in 10-15 minutes.

## 📱 App Features

This Plastic Tracker app includes:

- **Dashboard** - Track points, scans, fines, and eco score
- **Camera Scanner** - Real camera integration for product scanning
- **Bin Code Input** - Manual entry for trash bin codes (L520RE)
- **Points System** - Earn points for proper disposal
- **Modern UI** - Beautiful, responsive design

## 🔧 Build Options

### Command Line
```bash
# Development build (internal testing)
npm run build:ios

# Preview build (TestFlight)
npm run build:ios-preview

# Production build (App Store)
npm run build:ios-production
```

### Automated Scripts
```bash
# Linux/Mac
./scripts/build-ios.sh --profile preview

# Windows
scripts\build-ios.bat --profile preview
```

### GitHub Actions
The project includes automated CI/CD that builds on:
- Push to main/develop branches
- Pull requests
- Manual workflow dispatch

## 📋 Project Structure

```
project/
├── App.tsx                 # Main React Native app
├── app.json               # Expo configuration
├── eas.json               # EAS Build configuration
├── package.json           # Dependencies and scripts
├── scripts/
│   ├── build-ios.sh      # Linux/Mac build script
│   └── build-ios.bat     # Windows build script
├── .github/workflows/
│   └── build-ios.yml     # GitHub Actions workflow
├── build-ios.md          # Complete documentation
└── QUICK_START.md        # Quick start guide
```

## 🛠️ Development

### Local Development
```bash
# Start development server
npm start

# Run on iOS simulator (requires Mac)
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

### Testing the App
1. **Dashboard**: View stats and navigation
2. **Disposal Scanner**: 
   - Click "Open Camera & Scan Product"
   - Camera will open (simulated scan)
   - Enter bin code "L520RE"
   - Earn points for proper disposal

## 🔐 Environment Setup

### Required Secrets (for CI/CD)
```bash
EXPO_TOKEN=your_expo_token
EXPO_APPLE_TEAM_ID=your_team_id
EXPO_APPLE_APP_SPECIFIC_PASSWORD=your_app_specific_password
EXPO_IOS_DIST_P12_PASSWORD=your_p12_password
EXPO_IOS_DIST_P12_BASE64=base64_encoded_p12
EXPO_IOS_PROVISIONING_PROFILE_BASE64=base64_encoded_profile
```

### Local Environment
Create `.env` file:
```bash
EXPO_TOKEN=your_expo_token
EXPO_APPLE_TEAM_ID=your_team_id
EXPO_APPLE_APP_SPECIFIC_PASSWORD=your_app_specific_password
```

## 📚 Documentation

- **[Quick Start Guide](QUICK_START.md)** - Get building in 5 minutes
- **[Complete Build Guide](build-ios.md)** - Detailed documentation
- **[Expo Documentation](https://docs.expo.dev/)** - Official Expo docs
- **[EAS Build Guide](https://docs.expo.dev/build/introduction/)** - Build service docs

## 🆘 Troubleshooting

### Common Issues

**Build Fails with Certificate Error**
```bash
eas credentials --platform ios --clear
eas credentials --platform ios
```

**Build Times Out**
```bash
eas build:list --platform ios
eas build --platform ios --clear-cache
```

**Permission Denied**
```bash
eas whoami
eas logout && eas login
```

### Getting Help
- 📖 Check the [Complete Documentation](build-ios.md)
- 🌐 Visit [Expo Documentation](https://docs.expo.dev/)
- 💬 Join [Expo Community](https://forums.expo.dev/)
- 🐛 Report issues on GitHub

## 🎉 Success Metrics

This solution provides:

- **Zero Mac Requirement** - Build on any OS
- **10-15 Minute Builds** - Fast cloud-based builds
- **Automated Workflows** - CI/CD integration
- **Multiple Distribution Options** - TestFlight, App Store, direct install
- **Cost Effective** - Free tier + pay-per-build
- **Production Ready** - Full iOS app lifecycle support

## 📄 License

This project is provided as-is for educational and development purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the build process
5. Submit a pull request

## 📞 Support

For questions about this build solution:
- 📧 Create an issue on GitHub
- 💬 Join the Expo community forums
- 📖 Check the documentation links above

---

**Ready to build your first .ipa file?** Start with the [Quick Start Guide](QUICK_START.md)! 