import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Scan, 
  CheckCircle, 
  XCircle, 
  Award,
  Package,
  X
} from 'lucide-react';
import Webcam from 'react-webcam';
import { ScanResult } from '../types';

interface ScannerProps {
  onScan: (barcode: string) => ScanResult;
  isScanning: boolean;
  onScanningChange: (scanning: boolean) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onScan, isScanning, onScanningChange }) => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const handleScan = () => {
    setCameraActive(true);
    onScanningChange(true);
    
    // Simulate scanning delay - always scan Coca Cola
    setTimeout(() => {
      const cocaColaBarcode = '7311041030424'; // Coca Cola barcode
      const result = onScan(cocaColaBarcode);
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
        <h1 className="text-3xl font-bold text-gray-900">Product Scanner</h1>
        <p className="text-gray-600">Scan plastic packaging to earn points and track disposal</p>
      </div>

      {/* Scanner Interface */}
      <div className="relative">
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          {!scanResult ? (
            <div className="text-center space-y-6">
              {/* Camera Viewfinder */}
              {cameraActive ? (
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
              ) : (
                <div className="relative mx-auto w-64 h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center overflow-hidden">
                  <div className="text-center space-y-4">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto" />
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
                      <Camera className="w-5 h-5" />
                      <span>Open Camera & Start Scanning</span>
                    </div>
                  )}
                </button>
              )}
            </div>
          ) : (
            /* Scan Result */
            <div className="text-center space-y-6">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                scanResult.action === 'proper_disposal' 
                  ? 'bg-green-100 text-green-600' 
                  : scanResult.action === 'litter_found'
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-red-100 text-red-600'
              }`}>
                {scanResult.action === 'proper_disposal' ? (
                  <CheckCircle className="w-10 h-10" />
                ) : scanResult.action === 'litter_found' ? (
                  <Award className="w-10 h-10" />
                ) : (
                  <XCircle className="w-10 h-10" />
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {scanResult.action === 'proper_disposal' ? 'Great Job!' : 
                   scanResult.action === 'litter_found' ? 'Litter Reported!' : 
                   'Scan Failed'}
                </h3>
                <p className="text-gray-600">{scanResult.message}</p>
              </div>

              {scanResult.action !== 'invalid' && scanResult.product && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Product:</span>
                    <span className="text-gray-900">{scanResult.product.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Points Earned:</span>
                    <div className="flex items-center text-emerald-600 font-bold">
                      <Award className="w-4 h-4 mr-1" />
                      <span>+{scanResult.points}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={resetScanner}
                className="w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Scan Another Item</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-2xl p-4 space-y-2">
        <h3 className="font-semibold text-blue-900">How to Scan:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click "Open Camera & Start Scanning" to activate camera</li>
          <li>• Point camera at product barcode or QR code</li>
          <li>• Ensure good lighting and clear view</li>
          <li>• Hold steady until scan completes</li>
          <li>• Earn points for proper disposal!</li>
        </ul>
      </div>
    </div>
  );
};