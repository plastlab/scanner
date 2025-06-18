import React, { useState, useRef, useCallback } from 'react';
import { 
  Trash2, 
  Scan, 
  CheckCircle, 
  Award,
  Zap,
  Package,
  MapPin,
  Camera,
  X
} from 'lucide-react';
import Webcam from 'react-webcam';
import { ScanResult } from '../types';

interface DisposalScannerProps {
  onScan: (barcode: string, action: 'disposal') => ScanResult;
  isScanning: boolean;
  onScanningChange: (scanning: boolean) => void;
}

export const DisposalScanner: React.FC<DisposalScannerProps> = ({ 
  onScan, 
  isScanning, 
  onScanningChange 
}) => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanStep, setScanStep] = useState<'product' | 'trashcan'>('product');
  const [scannedProduct, setScannedProduct] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [binCode, setBinCode] = useState('');
  const [showBinInput, setShowBinInput] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const handleScan = () => {
    if (scanStep === 'product') {
      // For product scanning, we'll simulate with camera
      setCameraActive(true);
      onScanningChange(true);
      
      // Simulate scanning delay - always scan Coca Cola
      setTimeout(() => {
        const cocaColaBarcode = '7311041030424'; // Coca Cola barcode
        setScannedProduct(cocaColaBarcode);
        setScanStep('trashcan');
        setCameraActive(false);
        onScanningChange(false);
      }, 2000);
    } else {
      // For trash can, show input instead of camera
      setShowBinInput(true);
    }
  };

  const handleBinCodeSubmit = () => {
    if (binCode.trim() === '') return;
    
    onScanningChange(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const result = onScan(`${scannedProduct}|${binCode}`, 'disposal');
      setScanResult(result);
      setShowBinInput(false);
      setBinCode('');
      onScanningChange(false);
    }, 1000);
  };

  const resetScanner = () => {
    setScanResult(null);
    setScanStep('product');
    setScannedProduct(null);
    setCameraActive(false);
    setShowBinInput(false);
    setBinCode('');
  };

  const getCurrentInstruction = () => {
    if (scanStep === 'product') {
      return {
        title: 'Step 1: Scan Product',
        subtitle: 'Scan the barcode of the item you want to dispose',
        icon: Package,
        color: 'from-emerald-100 to-green-200',
        buttonText: 'Open Camera & Scan Product'
      };
    } else {
      return {
        title: 'Step 2: Enter Bin Code',
        subtitle: 'Enter the code displayed on the trash bin',
        icon: Trash2,
        color: 'from-orange-100 to-red-200',
        buttonText: 'Enter Bin Code'
      };
    }
  };

  const instruction = getCurrentInstruction();
  const Icon = instruction.icon;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Disposal Scanner</h1>
        <p className="text-gray-600">Scan your product and enter the bin code to earn points</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4">
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-xl ${
          scanStep === 'product' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
        }`}>
          <Package className="w-4 h-4" />
          <span className="text-sm font-medium">Product</span>
        </div>
        <div className="w-8 h-0.5 bg-gray-300"></div>
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-xl ${
          scanStep === 'trashcan' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
        }`}>
          <Trash2 className="w-4 h-4" />
          <span className="text-sm font-medium">Bin Code</span>
        </div>
      </div>

      {/* Scanner Interface */}
      <div className="relative">
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          {!scanResult ? (
            <div className="text-center space-y-6">
              {/* Current Step Info */}
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">{instruction.title}</h2>
                <p className="text-gray-600">{instruction.subtitle}</p>
              </div>

              {/* Camera or Input Interface */}
              {scanStep === 'product' && cameraActive ? (
                <div className="relative mx-auto w-64 h-64 bg-black rounded-2xl overflow-hidden">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                  />
                  {isScanning && (
                    <div className="absolute inset-0 bg-emerald-500 opacity-20 animate-pulse">
                      <div className="w-full h-1 bg-emerald-500 animate-pulse"></div>
                    </div>
                  )}
                  <button
                    onClick={() => setCameraActive(false)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : scanStep === 'trashcan' && showBinInput ? (
                <div className="space-y-4">
                  <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200">
                    <h3 className="font-semibold text-orange-900 mb-2">Enter Bin Code</h3>
                    <p className="text-sm text-orange-800 mb-3">
                      Look for the code displayed on the trash bin (e.g., L520RE)
                    </p>
                    <input
                      type="text"
                      value={binCode}
                      onChange={(e) => setBinCode(e.target.value.toUpperCase())}
                      placeholder="Enter bin code..."
                      className="w-full px-4 py-3 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      maxLength={10}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleBinCodeSubmit}
                      disabled={!binCode.trim() || isScanning}
                      className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                        !binCode.trim() || isScanning
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      {isScanning ? 'Processing...' : 'Submit Code'}
                    </button>
                    <button
                      onClick={() => setShowBinInput(false)}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`relative mx-auto w-64 h-64 bg-gradient-to-br ${instruction.color} rounded-2xl flex items-center justify-center overflow-hidden`}>
                  <div className="text-center space-y-4">
                    <Icon className="w-16 h-16 text-gray-400 mx-auto" />
                    <div className="space-y-2">
                      <div className="w-48 h-48 border-4 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                        {scanStep === 'product' ? (
                          <Camera className="w-8 h-8 text-gray-400" />
                        ) : (
                          <Trash2 className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              {!showBinInput && (
                <button
                  onClick={handleScan}
                  disabled={isScanning || cameraActive}
                  className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                    isScanning || cameraActive
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {isScanning ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Scanning...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      {scanStep === 'product' ? (
                        <>
                          <Camera className="w-5 h-5" />
                          <span>{instruction.buttonText}</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-5 h-5" />
                          <span>{instruction.buttonText}</span>
                        </>
                      )}
                    </div>
                  )}
                </button>
              )}
            </div>
          ) : (
            /* Scan Result */
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">Perfect Disposal!</h3>
                <p className="text-gray-600">{scanResult.message}</p>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 space-y-3">
                {scanResult.product && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Product:</span>
                      <span className="text-gray-900">{scanResult.product.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Disposed At:</span>
                      <div className="flex items-center text-gray-900">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{scanResult.product.disposalLocation}</span>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Points Earned:</span>
                  <div className="flex items-center text-emerald-600 font-bold">
                    <Award className="w-4 h-4 mr-1" />
                    <span>+{scanResult.points}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={resetScanner}
                className="w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Dispose Another Item</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-emerald-50 rounded-2xl p-4 space-y-2">
        <h3 className="font-semibold text-emerald-900">Disposal Process:</h3>
        <ul className="text-sm text-emerald-800 space-y-1">
          <li>• First, scan the product you want to dispose using the camera</li>
          <li>• Then, enter the code displayed on the trash bin (e.g., L520RE)</li>
          <li>• This proves proper disposal and earns you points</li>
          <li>• Prevents fines and helps keep the environment clean!</li>
        </ul>
      </div>
    </div>
  );
};