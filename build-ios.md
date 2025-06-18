# Complete Guide: Building iOS .ipa Files Without a Mac

This guide provides a complete solution to generate iOS .ipa files for React Native Expo projects without requiring a Mac, using Expo's cloud build service (EAS Build).

## Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **Expo CLI** (v5.2.0 or higher)
4. **EAS CLI** (v3.17.0 or higher)
5. **Expo Account** (free at https://expo.dev)
6. **Apple Developer Account** (for App Store distribution)

## Step 1: Install Dependencies

```bash
# Install Expo CLI globally
npm install -g @expo/cli

# Install EAS CLI globally
npm install -g eas-cli

# Install project dependencies
npm install
```

## Step 2: Configure EAS Build

### 2.1 Login to Expo

```bash
expo login
# or
eas login
```

### 2.2 Initialize EAS Build

```bash
eas build:configure
```

This will create the `eas.json` file with build profiles.

### 2.3 Configure iOS Build Settings

Update your `app.json` with your bundle identifier:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.plastictracker",
      "buildNumber": "1"
    }
  }
}
```

## Step 3: Set Up Apple Developer Credentials

### 3.1 Automatic Credential Management (Recommended)

EAS can automatically manage your credentials:

```bash
# Set up credentials for development builds
eas credentials --platform ios

# Set up credentials for production builds
eas credentials --platform ios --profile production
```

### 3.2 Manual Credential Setup (Alternative)

If you prefer manual setup:

1. **Provisioning Profile**: Download from Apple Developer Portal
2. **Distribution Certificate**: Export from Keychain (requires Mac)
3. **App Store Connect API Key**: Generate in App Store Connect

Set environment variables:

```bash
export EXPO_IOS_DIST_P12_PASSWORD="your-p12-password"
export EXPO_IOS_DIST_P12_BASE64="base64-encoded-p12-file"
export EXPO_IOS_PROVISIONING_PROFILE_BASE64="base64-encoded-provisioning-profile"
```

## Step 4: Build Configuration

### 4.1 Development Build

```bash
# Build for internal testing
eas build --platform ios --profile development
```

### 4.2 Preview Build

```bash
# Build for TestFlight
eas build --platform ios --profile preview
```

### 4.3 Production Build

```bash
# Build for App Store
eas build --platform ios --profile production
```

## Step 5: Build Process

### 5.1 Start the Build

```bash
# Start iOS build
npm run build:ios

# Or use EAS CLI directly
eas build --platform ios
```

### 5.2 Monitor Build Progress

The build will run on Expo's servers. You can monitor progress:

1. **Terminal**: Real-time logs
2. **Expo Dashboard**: Web interface at https://expo.dev
3. **Email**: Notifications when complete

### 5.3 Build Completion

When the build completes, you'll receive:

- **Download Link**: Direct .ipa file download
- **QR Code**: For easy installation on devices
- **Build Logs**: Detailed build information

## Step 6: Download and Install

### 6.1 Download .ipa File

```bash
# Download the built .ipa
curl -L "BUILD_DOWNLOAD_URL" -o "plastic-tracker.ipa"
```

### 6.2 Install on Device

**Option A: Using Expo Go (Development)**
- Scan QR code with Expo Go app
- Install directly on device

**Option B: Using TestFlight (Preview/Production)**
- Upload .ipa to App Store Connect
- Distribute via TestFlight

**Option C: Direct Installation**
- Use tools like Diawi or TestFlight
- Install via Safari on iOS device

## Step 7: Automated Build Scripts

### 7.1 Create Build Script

Create `scripts/build-ios.sh`:

```bash
#!/bin/bash

# Build iOS .ipa file
echo "🚀 Starting iOS build..."

# Check if logged in
if ! eas whoami; then
    echo "❌ Not logged in to Expo. Please run: eas login"
    exit 1
fi

# Build for iOS
echo "📱 Building for iOS..."
eas build --platform ios --non-interactive

# Wait for build completion
echo "⏳ Waiting for build to complete..."
BUILD_ID=$(eas build:list --platform ios --limit 1 --json | jq -r '.[0].id')

while true; do
    STATUS=$(eas build:view $BUILD_ID --json | jq -r '.status')
    echo "Build status: $STATUS"
    
    if [ "$STATUS" = "finished" ]; then
        echo "✅ Build completed successfully!"
        DOWNLOAD_URL=$(eas build:view $BUILD_ID --json | jq -r '.artifacts.buildUrl')
        echo "📥 Download URL: $DOWNLOAD_URL"
        break
    elif [ "$STATUS" = "errored" ]; then
        echo "❌ Build failed!"
        exit 1
    fi
    
    sleep 30
done
```

### 7.2 Make Script Executable

```bash
chmod +x scripts/build-ios.sh
```

### 7.3 Run Automated Build

```bash
./scripts/build-ios.sh
```

## Step 8: Environment Variables

Create `.env` file for sensitive data:

```bash
# Apple Developer Account
EXPO_APPLE_APP_SPECIFIC_PASSWORD=your-app-specific-password
EXPO_APPLE_TEAM_ID=your-team-id

# Build Configuration
EXPO_IOS_DIST_P12_PASSWORD=your-p12-password
EXPO_IOS_DIST_P12_BASE64=base64-encoded-p12
EXPO_IOS_PROVISIONING_PROFILE_BASE64=base64-encoded-profile

# App Store Connect API
EXPO_APP_STORE_CONNECT_API_KEY_ID=your-api-key-id
EXPO_APP_STORE_CONNECT_API_KEY_ISSUER_ID=your-issuer-id
EXPO_APP_STORE_CONNECT_API_KEY_BASE64=base64-encoded-api-key
```

## Step 9: Continuous Integration

### 9.1 GitHub Actions Workflow

Create `.github/workflows/build-ios.yml`:

```yaml
name: Build iOS App

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Expo CLI
      run: npm install -g @expo/cli eas-cli
    
    - name: Login to Expo
      run: eas login --non-interactive
      env:
        EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
    
    - name: Build iOS
      run: eas build --platform ios --non-interactive
      env:
        EXPO_IOS_DIST_P12_PASSWORD: ${{ secrets.EXPO_IOS_DIST_P12_PASSWORD }}
        EXPO_IOS_DIST_P12_BASE64: ${{ secrets.EXPO_IOS_DIST_P12_BASE64 }}
        EXPO_IOS_PROVISIONING_PROFILE_BASE64: ${{ secrets.EXPO_IOS_PROVISIONING_PROFILE_BASE64 }}
    
    - name: Upload artifact
      uses: actions/upload-artifact@v3
      with:
        name: ios-build
        path: build/
```

### 9.2 GitLab CI Pipeline

Create `.gitlab-ci.yml`:

```yaml
stages:
  - build

build_ios:
  stage: build
  image: node:18
  script:
    - npm install -g @expo/cli eas-cli
    - npm ci
    - eas login --non-interactive
    - eas build --platform ios --non-interactive
  artifacts:
    paths:
      - build/
    expire_in: 1 week
  only:
    - main
```

## Step 10: Troubleshooting

### 10.1 Common Issues

**Build Fails with Certificate Error**
```bash
# Regenerate credentials
eas credentials --platform ios --clear
eas credentials --platform ios
```

**Build Times Out**
```bash
# Check build status
eas build:list --platform ios

# Retry build
eas build --platform ios --clear-cache
```

**Permission Denied**
```bash
# Check Expo login
eas whoami

# Re-login if needed
eas logout
eas login
```

### 10.2 Build Optimization

**Reduce Build Time**
- Use `--clear-cache` sparingly
- Optimize dependencies
- Use specific Expo SDK versions

**Reduce Bundle Size**
- Enable Hermes engine
- Use ProGuard for Android
- Optimize images and assets

## Step 11: Distribution

### 11.1 TestFlight Distribution

```bash
# Submit to TestFlight
eas submit --platform ios
```

### 11.2 App Store Distribution

```bash
# Submit to App Store
eas submit --platform ios --latest
```

### 11.3 Enterprise Distribution

```bash
# Build for enterprise
eas build --platform ios --profile enterprise
```

## Summary

This complete solution provides:

✅ **No Mac Required**: All builds run on Expo's cloud servers
✅ **Automated Credentials**: EAS handles certificate management
✅ **Multiple Build Types**: Development, preview, and production builds
✅ **CI/CD Integration**: GitHub Actions and GitLab CI support
✅ **Direct Download**: .ipa files available immediately after build
✅ **TestFlight Ready**: Automatic submission to TestFlight
✅ **Cost Effective**: Free tier available, pay-per-build pricing

## Next Steps

1. **Set up your Apple Developer account**
2. **Configure EAS credentials**
3. **Run your first build**
4. **Set up CI/CD pipeline**
5. **Distribute via TestFlight**

For more information, visit:
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Expo iOS Build Guide](https://docs.expo.dev/build/setup/)
- [Apple Developer Documentation](https://developer.apple.com/documentation/) 