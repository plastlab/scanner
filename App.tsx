import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'consumer' | 'worker' | 'admin';
  points: number;
  totalScanned: number;
  totalFines: number;
  unpaidFines: number;
}

interface Product {
  id: string;
  name: string;
  barcode: string;
  category: string;
  registeredTo: string;
  purchaseDate: Date;
  disposed: boolean;
  disposalDate?: Date;
  disposalLocation?: string;
  trashCanId?: string;
  scannedBy?: string;
}

interface ScanResult {
  product?: Product;
  trashCan?: any;
  points: number;
  action: 'product_purchased' | 'proper_disposal' | 'litter_found' | 'invalid';
  message: string;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [binCode, setBinCode] = useState('');
  const [showBinInput, setShowBinInput] = useState(false);
  const [scanStep, setScanStep] = useState<'product' | 'trashcan'>('product');
  const [scannedProduct, setScannedProduct] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    // Initialize with sample user
    const sampleUser: User = {
      id: 'user_1',
      name: 'John Doe',
      email: 'john@example.com',
      type: 'consumer',
      points: 0,
      totalScanned: 0,
      totalFines: 0,
      unpaidFines: 0
    };
    setCurrentUser(sampleUser);
  }, []);

  const handleScan = () => {
    if (scanStep === 'product') {
      setCameraActive(true);
      setIsScanning(true);
      
      // Simulate scanning delay - always scan Coca Cola
      setTimeout(() => {
        const cocaColaBarcode = '7311041030424';
        setScannedProduct(cocaColaBarcode);
        setScanStep('trashcan');
        setCameraActive(false);
        setIsScanning(false);
      }, 2000);
    } else {
      setShowBinInput(true);
    }
  };

  const handleBinCodeSubmit = () => {
    if (binCode.trim() === '') return;
    
    setIsScanning(true);
    
    setTimeout(() => {
      const result = handleDisposalScan(`${scannedProduct}|${binCode}`);
      setScanResult(result);
      setShowBinInput(false);
      setBinCode('');
      setIsScanning(false);
    }, 1000);
  };

  const handleDisposalScan = (combinedBarcode: string): ScanResult => {
    const [productBarcode, trashCanBarcode] = combinedBarcode.split('|');
    
    if (trashCanBarcode !== 'L520RE') {
      return {
        points: 0,
        action: 'invalid',
        message: `Invalid bin code "${trashCanBarcode}". Please enter a valid code (e.g., L520RE).`
      };
    }

    // Award points
    const pointsEarned = 15;
    if (currentUser) {
      setCurrentUser(prev => prev ? { 
        ...prev, 
        points: prev.points + pointsEarned, 
        totalScanned: prev.totalScanned + 1 
      } : null);
    }

    return {
      product: {
        id: 'prod_1',
        name: 'Coca Cola 0.5L',
        barcode: productBarcode,
        category: 'Beverage',
        registeredTo: currentUser?.id || '',
        purchaseDate: new Date(),
        disposed: true,
        disposalDate: new Date(),
        disposalLocation: 'Wang-ung romerike',
        trashCanId: 'tc1'
      },
      points: pointsEarned,
      action: 'proper_disposal',
      message: 'Perfect! Product properly disposed and points earned!'
    };
  };

  const resetScanner = () => {
    setScanResult(null);
    setScanStep('product');
    setScannedProduct(null);
    setCameraActive(false);
    setShowBinInput(false);
    setBinCode('');
  };

  const renderDashboard = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back, {currentUser?.name}! 👋</Text>
        <Text style={styles.subtitle}>Track your plastic footprint and earn rewards</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#ecfdf5' }]}>
            <Ionicons name="trophy" size={20} color="#059669" />
          </View>
          <Text style={styles.statValue}>{currentUser?.points.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Points Balance</Text>
          <Text style={styles.statChange}>+125 this week</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#eff6ff' }]}>
            <Ionicons name="reload" size={20} color="#2563eb" />
          </View>
          <Text style={styles.statValue}>{currentUser?.totalScanned.toString()}</Text>
          <Text style={styles.statLabel}>Items Scanned</Text>
          <Text style={styles.statChange}>+5 today</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#fef2f2' }]}>
            <Ionicons name="warning" size={20} color="#dc2626" />
          </View>
          <Text style={styles.statValue}>{currentUser?.unpaidFines.toString()}</Text>
          <Text style={styles.statLabel}>Unpaid Fines</Text>
          <Text style={styles.statChange}>
            {currentUser && currentUser.unpaidFines > 0 ? 'Pay by due date' : 'All clear!'}
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#f0fdf4' }]}>
            <Ionicons name="trending-up" size={20} color="#16a34a" />
          </View>
          <Text style={styles.statValue}>
            {currentUser ? Math.round((currentUser.points / 10)).toString() + '%' : '0%'}
          </Text>
          <Text style={styles.statLabel}>Eco Score</Text>
          <Text style={styles.statChange}>Excellent rating</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderDisposalScanner = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Disposal Scanner</Text>
        <Text style={styles.subtitle}>Scan your product and enter the bin code to earn points</Text>
      </View>

      <View style={styles.progressIndicator}>
        <View style={[
          styles.progressStep, 
          scanStep === 'product' ? styles.progressStepActive : styles.progressStepInactive
        ]}>
          <Ionicons name="cube" size={16} color={scanStep === 'product' ? '#059669' : '#9ca3af'} />
          <Text style={[
            styles.progressText, 
            scanStep === 'product' ? styles.progressTextActive : styles.progressTextInactive
          ]}>Product</Text>
        </View>
        <View style={styles.progressLine} />
        <View style={[
          styles.progressStep, 
          scanStep === 'trashcan' ? styles.progressStepActive : styles.progressStepInactive
        ]}>
          <Ionicons name="trash" size={16} color={scanStep === 'trashcan' ? '#f97316' : '#9ca3af'} />
          <Text style={[
            styles.progressText, 
            scanStep === 'trashcan' ? styles.progressTextActive : styles.progressTextInactive
          ]}>Bin Code</Text>
        </View>
      </View>

      <View style={styles.scannerContainer}>
        {!scanResult ? (
          <View style={styles.scannerContent}>
            <Text style={styles.stepTitle}>
              {scanStep === 'product' ? 'Step 1: Scan Product' : 'Step 2: Enter Bin Code'}
            </Text>
            <Text style={styles.stepSubtitle}>
              {scanStep === 'product' 
                ? 'Scan the barcode of the item you want to dispose' 
                : 'Enter the code displayed on the trash bin'
              }
            </Text>

            {scanStep === 'product' && cameraActive ? (
              <View style={styles.cameraContainer}>
                <Camera style={styles.camera} type={Camera.Constants.Type.back}>
                  {isScanning && (
                    <View style={styles.scanningOverlay}>
                      <View style={styles.scanningLine} />
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.closeCameraButton}
                    onPress={() => setCameraActive(false)}
                  >
                    <Ionicons name="close" size={20} color="white" />
                  </TouchableOpacity>
                </Camera>
              </View>
            ) : scanStep === 'trashcan' && showBinInput ? (
              <View style={styles.binInputContainer}>
                <View style={styles.binInputCard}>
                  <Text style={styles.binInputTitle}>Enter Bin Code</Text>
                  <Text style={styles.binInputSubtitle}>
                    Look for the code displayed on the trash bin (e.g., L520RE)
                  </Text>
                  <TextInput
                    style={styles.binInput}
                    value={binCode}
                    onChangeText={(text) => setBinCode(text.toUpperCase())}
                    placeholder="Enter bin code..."
                    maxLength={10}
                    autoCapitalize="characters"
                  />
                </View>
                <View style={styles.binInputButtons}>
                  <TouchableOpacity
                    style={[
                      styles.binInputButton, 
                      styles.binInputButtonPrimary,
                      (!binCode.trim() || isScanning) && styles.binInputButtonDisabled
                    ]}
                    onPress={handleBinCodeSubmit}
                    disabled={!binCode.trim() || isScanning}
                  >
                    <Text style={[
                      styles.binInputButtonText,
                      styles.binInputButtonTextPrimary,
                      (!binCode.trim() || isScanning) && styles.binInputButtonTextDisabled
                    ]}>
                      {isScanning ? 'Processing...' : 'Submit Code'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.binInputButton}
                    onPress={() => setShowBinInput(false)}
                  >
                    <Text style={styles.binInputButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={[
                styles.scannerViewfinder,
                scanStep === 'product' ? styles.scannerViewfinderProduct : styles.scannerViewfinderTrash
              ]}>
                <Ionicons 
                  name={scanStep === 'product' ? 'camera' : 'trash'} 
                  size={64} 
                  color="#9ca3af" 
                />
                <View style={styles.scannerFrame}>
                  <Ionicons 
                    name={scanStep === 'product' ? 'scan' : 'trash'} 
                    size={32} 
                    color="#9ca3af" 
                  />
                </View>
              </View>
            )}

            {!showBinInput && (
              <TouchableOpacity
                style={[
                  styles.scanButton,
                  (isScanning || cameraActive) && styles.scanButtonDisabled
                ]}
                onPress={handleScan}
                disabled={isScanning || cameraActive}
              >
                {isScanning ? (
                  <View style={styles.scanButtonLoading}>
                    <View style={styles.loadingSpinner} />
                    <Text style={styles.scanButtonText}>Scanning...</Text>
                  </View>
                ) : (
                  <View style={styles.scanButtonContent}>
                    <Ionicons 
                      name={scanStep === 'product' ? 'camera' : 'trash'} 
                      size={20} 
                      color="white" 
                    />
                    <Text style={styles.scanButtonText}>
                      {scanStep === 'product' ? 'Open Camera & Scan Product' : 'Enter Bin Code'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.scanResult}>
            <View style={styles.resultIcon}>
              <Ionicons name="checkmark-circle" size={40} color="#16a34a" />
            </View>
            <Text style={styles.resultTitle}>Perfect Disposal!</Text>
            <Text style={styles.resultMessage}>{scanResult.message}</Text>

            <View style={styles.resultDetails}>
              {scanResult.product && (
                <>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Product:</Text>
                    <Text style={styles.resultValue}>{scanResult.product.name}</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Disposed At:</Text>
                    <Text style={styles.resultValue}>{scanResult.product.disposalLocation}</Text>
                  </View>
                </>
              )}
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Points Earned:</Text>
                <View style={styles.pointsContainer}>
                  <Ionicons name="trophy" size={16} color="#059669" />
                  <Text style={styles.pointsText}>+{scanResult.points}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.resetButton} onPress={resetScanner}>
              <Ionicons name="cube" size={20} color="#6b7280" />
              <Text style={styles.resetButtonText}>Dispose Another Item</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>Disposal Process:</Text>
        <Text style={styles.instructionsText}>• First, scan the product you want to dispose using the camera</Text>
        <Text style={styles.instructionsText}>• Then, enter the code displayed on the trash bin (e.g., L520RE)</Text>
        <Text style={styles.instructionsText}>• This proves proper disposal and earns you points</Text>
        <Text style={styles.instructionsText}>• Prevents fines and helps keep the environment clean!</Text>
      </View>
    </ScrollView>
  );

  const renderNavigation = () => (
    <View style={styles.navigation}>
      <TouchableOpacity
        style={[styles.navButton, currentView === 'dashboard' && styles.navButtonActive]}
        onPress={() => setCurrentView('dashboard')}
      >
        <Ionicons 
          name="home" 
          size={24} 
          color={currentView === 'dashboard' ? '#059669' : '#6b7280'} 
        />
        <Text style={[
          styles.navButtonText,
          currentView === 'dashboard' && styles.navButtonTextActive
        ]}>Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navButton, currentView === 'disposal' && styles.navButtonActive]}
        onPress={() => setCurrentView('disposal')}
      >
        <Ionicons 
          name="scan" 
          size={24} 
          color={currentView === 'disposal' ? '#059669' : '#6b7280'} 
        />
        <Text style={[
          styles.navButtonText,
          currentView === 'disposal' && styles.navButtonTextActive
        ]}>Dispose</Text>
      </TouchableOpacity>
    </View>
  );

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'disposal' && renderDisposalScanner()}
      {renderNavigation()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  statChange: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  progressIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  progressStepActive: {
    backgroundColor: '#ecfdf5',
  },
  progressStepInactive: {
    backgroundColor: '#f3f4f6',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  progressTextActive: {
    color: '#059669',
  },
  progressTextInactive: {
    color: '#6b7280',
  },
  progressLine: {
    width: 32,
    height: 2,
    backgroundColor: '#d1d5db',
    marginHorizontal: 8,
  },
  scannerContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    margin: 16,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scannerContent: {
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  cameraContainer: {
    width: 256,
    height: 256,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'black',
    marginBottom: 24,
  },
  camera: {
    flex: 1,
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 150, 105, 0.2)',
    justifyContent: 'center',
  },
  scanningLine: {
    height: 4,
    backgroundColor: '#059669',
    width: '100%',
  },
  closeCameraButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ef4444',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  binInputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  binInputCard: {
    backgroundColor: '#fff7ed',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fed7aa',
    marginBottom: 16,
  },
  binInputTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#c2410c',
    marginBottom: 8,
  },
  binInputSubtitle: {
    fontSize: 14,
    color: '#ea580c',
    marginBottom: 12,
  },
  binInput: {
    borderWidth: 1,
    borderColor: '#f97316',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  binInputButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  binInputButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  binInputButtonPrimary: {
    backgroundColor: '#f97316',
  },
  binInputButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  binInputButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  binInputButtonTextPrimary: {
    color: 'white',
  },
  binInputButtonTextDisabled: {
    color: '#9ca3af',
  },
  scannerViewfinder: {
    width: 256,
    height: 256,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  scannerViewfinderProduct: {
    backgroundColor: '#ecfdf5',
  },
  scannerViewfinderTrash: {
    backgroundColor: '#fff7ed',
  },
  scannerFrame: {
    width: 192,
    height: 192,
    borderWidth: 4,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  scanButton: {
    backgroundColor: '#059669',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  scanButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  scanButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scanButtonLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingSpinner: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: 'white',
    borderTopColor: 'transparent',
    borderRadius: 10,
  },
  scanButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  scanResult: {
    alignItems: 'center',
  },
  resultIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  resultMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  resultDetails: {
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 24,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  resultValue: {
    fontSize: 14,
    color: '#111827',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#059669',
  },
  resetButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  instructions: {
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    padding: 16,
    margin: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065f46',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#047857',
    marginBottom: 4,
  },
  navigation: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 8,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navButtonActive: {
    backgroundColor: '#f0fdf4',
  },
  navButtonText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  navButtonTextActive: {
    color: '#059669',
    fontWeight: '600',
  },
}); 