#!/bin/bash

# Build iOS .ipa file without Mac
# This script automates the entire iOS build process using EAS Build

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js v16 or higher."
        exit 1
    fi
    
    # Check npm
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    # Check Expo CLI
    if ! command_exists expo; then
        print_warning "Expo CLI not found. Installing..."
        npm install -g @expo/cli
    fi
    
    # Check EAS CLI
    if ! command_exists eas; then
        print_warning "EAS CLI not found. Installing..."
        npm install -g eas-cli
    fi
    
    print_success "All prerequisites are satisfied"
}

# Function to check Expo login
check_expo_login() {
    print_status "Checking Expo login status..."
    
    if ! eas whoami >/dev/null 2>&1; then
        print_error "Not logged in to Expo. Please run: eas login"
        print_status "You can create a free account at https://expo.dev"
        exit 1
    fi
    
    print_success "Logged in to Expo"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    print_success "Dependencies installed"
}

# Function to configure build
configure_build() {
    print_status "Configuring build..."
    
    # Check if eas.json exists
    if [ ! -f "eas.json" ]; then
        print_warning "eas.json not found. Running EAS configure..."
        eas build:configure --non-interactive
    fi
    
    # Check if app.json has proper iOS configuration
    if ! grep -q '"bundleIdentifier"' app.json; then
        print_warning "iOS bundle identifier not configured in app.json"
        print_status "Please update app.json with your bundle identifier"
    fi
    
    print_success "Build configuration ready"
}

# Function to start build
start_build() {
    local profile=${1:-"preview"}
    
    print_status "Starting iOS build with profile: $profile"
    
    # Start the build
    eas build --platform ios --profile "$profile" --non-interactive
    
    print_success "Build started successfully"
}

# Function to monitor build progress
monitor_build() {
    print_status "Monitoring build progress..."
    
    # Get the latest build ID
    BUILD_ID=$(eas build:list --platform ios --limit 1 --json | jq -r '.[0].id')
    
    if [ "$BUILD_ID" = "null" ] || [ -z "$BUILD_ID" ]; then
        print_error "Could not find build ID"
        exit 1
    fi
    
    print_status "Build ID: $BUILD_ID"
    
    # Monitor build status
    while true; do
        STATUS=$(eas build:view "$BUILD_ID" --json | jq -r '.status')
        
        case $STATUS in
            "finished")
                print_success "Build completed successfully!"
                DOWNLOAD_URL=$(eas build:view "$BUILD_ID" --json | jq -r '.artifacts.buildUrl')
                if [ "$DOWNLOAD_URL" != "null" ] && [ -n "$DOWNLOAD_URL" ]; then
                    print_success "Download URL: $DOWNLOAD_URL"
                    echo "$DOWNLOAD_URL" > build-download-url.txt
                fi
                break
                ;;
            "errored")
                print_error "Build failed!"
                print_status "Check build logs for details:"
                eas build:view "$BUILD_ID"
                exit 1
                ;;
            "canceled")
                print_warning "Build was canceled"
                exit 1
                ;;
            *)
                print_status "Build status: $STATUS (waiting 30 seconds...)"
                sleep 30
                ;;
        esac
    done
}

# Function to download .ipa file
download_ipa() {
    if [ -f "build-download-url.txt" ]; then
        DOWNLOAD_URL=$(cat build-download-url.txt)
        print_status "Downloading .ipa file..."
        
        # Create builds directory if it doesn't exist
        mkdir -p builds
        
        # Download the .ipa file
        curl -L "$DOWNLOAD_URL" -o "builds/plastic-tracker.ipa"
        
        if [ $? -eq 0 ]; then
            print_success "Downloaded: builds/plastic-tracker.ipa"
            print_status "File size: $(du -h builds/plastic-tracker.ipa | cut -f1)"
        else
            print_error "Failed to download .ipa file"
            exit 1
        fi
    else
        print_warning "No download URL found. Build may still be processing."
    fi
}

# Function to show build information
show_build_info() {
    print_status "Build Information:"
    echo "===================="
    
    if [ -f "builds/plastic-tracker.ipa" ]; then
        echo "✅ .ipa file: builds/plastic-tracker.ipa"
        echo "📱 File size: $(du -h builds/plastic-tracker.ipa | cut -f1)"
        echo "📅 Created: $(stat -c %y builds/plastic-tracker.ipa 2>/dev/null || stat -f %Sm builds/plastic-tracker.ipa 2>/dev/null || echo 'Unknown')"
    fi
    
    echo ""
    print_status "Next steps:"
    echo "1. Install on device using TestFlight or direct installation"
    echo "2. Test the app thoroughly"
    echo "3. Submit to App Store if ready for production"
    echo ""
    print_status "For TestFlight distribution, run: eas submit --platform ios"
}

# Function to clean up
cleanup() {
    print_status "Cleaning up temporary files..."
    rm -f build-download-url.txt
    print_success "Cleanup completed"
}

# Main execution
main() {
    echo "🚀 iOS Build Automation Script"
    echo "=============================="
    echo ""
    
    # Parse command line arguments
    PROFILE="preview"
    while [[ $# -gt 0 ]]; do
        case $1 in
            --profile)
                PROFILE="$2"
                shift 2
                ;;
            --help)
                echo "Usage: $0 [--profile development|preview|production]"
                echo ""
                echo "Options:"
                echo "  --profile    Build profile (default: preview)"
                echo "  --help       Show this help message"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done
    
    # Execute build process
    check_prerequisites
    check_expo_login
    install_dependencies
    configure_build
    start_build "$PROFILE"
    monitor_build
    download_ipa
    show_build_info
    cleanup
    
    print_success "iOS build process completed successfully!"
}

# Trap to ensure cleanup on exit
trap cleanup EXIT

# Run main function
main "$@" 