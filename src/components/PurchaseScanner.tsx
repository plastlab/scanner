import React, { useState, useRef } from 'react';
import { 
  ShoppingCart, 
  Scan, 
  CheckCircle, 
  Package,
  Plus,
  Zap,
  Camera,
  X
} from 'lucide-react';
import Webcam from 'react-webcam';
import { ScanResult, Product } from '../types';

interface PurchaseScannerProps {
  onScan: (barcode: string, action: 'purchase') => ScanResult;
  isScanning: boolean;
  onScanningChange: (scanning: boolean) => void;
}

export const PurchaseScanner: React.FC<PurchaseScannerProps> = ({ 
  onScan, 
  isScanning, 
  onScanningChange 
}) => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const handleScan = () => {
    setCameraActive(true);
    onScanningChange(true);
    
    // Simulate scanning delay - always scan Coca Cola
    setTimeout(() => {
      const cocaColaBarcode = '7311041030424'; // Coca Cola barcode
      const result = onScan(cocaColaBarcode, 'purchase');
      setScanResult(result);
      setCameraActive(false);
      onScanningChange(false);
    }, 2000);
  };

  const resetScanner = () => {
    setScanResult(null);
    setCameraActive(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Purchase Scanner</h1>
        <p className="text-gray-600">Scan products you just bought to register them to your account</p>
      </div>

      {/* Scanner Interface */}
      <div className="relative">
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          {!scanResult ? (
            <div className="text-center space-y-6">
              {/* Scanner Viewfinder */}
              {cameraActive ? (
                <div className="relative mx-auto w-64 h-64 bg-black rounded-2xl overflow-hidden">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                  />
                  {isScanning && (
                    <div className="absolute inset-0 bg-blue-500 opacity-20 animate-pulse">
                      <div className="w-full h-1 bg-blue-500 animate-pulse"></div>
                    </div>
                  )}
                  <button
                    onClick={() => setCameraActive(false)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  </div>
                ) : (
                <div className="relative mx-auto w-64 h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center overflow-hidden">
                  <div className="text-center space-y-4">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto" />
                    <div className="space-y-2">
                      <div className="w-48 h-48 border-4 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                        <Scan className="w-8 h-8 text-gray-400" />
                      </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Scan Button */}
              {!cameraActive && (
              <button
                onClick={handleScan}
                disabled={isScanning}
                className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                  isScanning
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isScanning ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Scanning Product...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                      <Camera className="w-5 h-5" />
                      <span>Open Camera & Scan Product</span>
                  </div>
                )}
              </button>
              )}
            </div>
          ) : (
            /* Scan Result */
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">Product Registered!</h3>
                <p className="text-gray-600">{scanResult.message}</p>
              </div>

              {scanResult.product && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Product:</span>
                    <span className="text-gray-900">{scanResult.product.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Category:</span>
                    <span className="text-gray-900">{scanResult.product.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Registered:</span>
                    <span className="text-gray-900">
                      {scanResult.product.purchaseDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={resetScanner}
                className="w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Scan Another Product</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-2xl p-4 space-y-2">
        <h3 className="font-semibold text-blue-900">How to Register Products:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click "Open Camera & Scan Product" to activate camera</li>
          <li>• Scan the barcode of products you just purchased</li>
          <li>• This registers the packaging to your account</li>
          <li>• You'll be responsible for proper disposal</li>
          <li>• Scan again when disposing to avoid fines!</li>
        </ul>
      </div>
    </div>
  );
};