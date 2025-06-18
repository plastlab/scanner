import { useState, useEffect } from 'react';
import { User, Product, Fine, ScanResult, LoginData, TrashCan } from '../types';

export const useApp = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [fines, setFines] = useState<Fine[]>([]);
  const [trashCans, setTrashCans] = useState<TrashCan[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  // Initialize trash cans data
  useEffect(() => {
    const sampleTrashCans: TrashCan[] = [
      {
        id: 'tc1',
        barcode: 'L520RE',
        location: 'Wang-ung romerike',
        type: 'general',
        municipality: 'Lorenskog'
      },
      {
        id: 'tc2',
        barcode: 'TC002',
        location: 'Frogner Park - Main Entrance',
        type: 'recycling',
        municipality: 'Oslo'
      },
      {
        id: 'tc3',
        barcode: 'TC003',
        location: 'Aker Brygge - Shopping Center',
        type: 'general',
        municipality: 'Oslo'
      }
    ];

    setTrashCans(sampleTrashCans);
  }, []);

  const handleLogin = (loginData: LoginData) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: loginData.name,
      email: loginData.email,
      type: 'consumer',
      points: 0,
      totalScanned: 0,
      totalFines: 0,
      unpaidFines: 0
    };

    setCurrentUser(newUser);
    
    // Initialize with some sample products for demo
    const sampleProducts: Product[] = [
      {
        id: 'prod1',
        name: 'Coca Cola 0.5L',
        barcode: '7311041030424',
        category: 'Beverage',
        registeredTo: newUser.id,
        purchaseDate: new Date('2024-01-15'),
        disposed: false
      },
      {
        id: 'prod2',
        name: 'Sandwich Wrapper',
        barcode: '7311041030425',
        category: 'Food Packaging',
        registeredTo: newUser.id,
        purchaseDate: new Date('2024-01-16'),
        disposed: false
      }
    ];

    setProducts(sampleProducts);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setProducts([]);
    setFines([]);
    setCurrentView('dashboard');
  };

  const scanProduct = (barcode: string, action: 'purchase' | 'disposal'): ScanResult => {
    if (action === 'purchase') {
      return handlePurchaseScan(barcode);
    } else {
      return handleDisposalScan(barcode);
    }
  };

  const handlePurchaseScan = (barcode: string): ScanResult => {
    // Always create a Coca Cola bottle
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      name: 'Coca Cola 0.5L',
      barcode: barcode,
      category: 'Beverage',
      registeredTo: currentUser?.id || '',
      purchaseDate: new Date(),
      disposed: false
    };

    setProducts(prev => [...prev, newProduct]);

    return {
      product: newProduct,
      points: 0,
      action: 'product_purchased',
      message: 'Coca Cola bottle registered to your account. Remember to scan when disposing!'
    };
  };

  const handleDisposalScan = (combinedBarcode: string): ScanResult => {
    const [productBarcode, trashCanBarcode] = combinedBarcode.split('|');
    
    const product = products.find(p => p.barcode === productBarcode && !p.disposed);
    const trashCan = trashCans.find(tc => tc.barcode === trashCanBarcode);
    
    if (!product) {
      return {
        points: 0,
        action: 'invalid',
        message: 'Product not found or already disposed'
      };
    }

    if (!trashCan) {
      return {
        points: 0,
        action: 'invalid',
        message: `Invalid bin code "${trashCanBarcode}". Please enter a valid code (e.g., L520RE).`
      };
    }

    // Update product as disposed
    setProducts(prev => prev.map(p => 
      p.id === product.id 
        ? { 
            ...p, 
            disposed: true, 
            disposalDate: new Date(), 
            disposalLocation: trashCan.location,
            trashCanId: trashCan.id
          }
        : p
    ));
    
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
        ...product,
        disposed: true,
        disposalDate: new Date(),
        disposalLocation: trashCan.location,
        trashCanId: trashCan.id
      },
      trashCan,
      points: pointsEarned,
      action: 'proper_disposal',
      message: 'Perfect! Product properly disposed and points earned!'
    };
  };

  return {
    currentUser,
    currentView,
    setCurrentView,
    products,
    fines,
    trashCans,
    isScanning,
    setIsScanning,
    scanProduct,
    handleLogin,
    handleLogout
  };
};