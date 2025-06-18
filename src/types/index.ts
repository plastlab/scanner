export interface User {
  id: string;
  name: string;
  email: string;
  type: 'consumer' | 'worker' | 'admin';
  points: number;
  totalScanned: number;
  totalFines: number;
  unpaidFines: number;
}

export interface Product {
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

export interface TrashCan {
  id: string;
  barcode: string;
  location: string;
  type: 'general' | 'recycling' | 'organic';
  municipality: string;
}

export interface Fine {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  location: string;
  date: Date;
  paid: boolean;
  dueDate: Date;
  scannedBy: string;
}

export interface ScanResult {
  product?: Product;
  trashCan?: TrashCan;
  points: number;
  action: 'product_purchased' | 'proper_disposal' | 'litter_found' | 'invalid';
  message: string;
}

export interface LoginData {
  name: string;
  email: string;
}