import React from 'react';
import { 
  Award, 
  Recycle, 
  AlertTriangle, 
  TrendingUp,
  Package,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { User, Product } from '../types';

interface DashboardProps {
  user: User;
  products: Product[];
  onViewChange: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, products, onViewChange }) => {
  const disposedProducts = products.filter(p => p.disposed);
  const pendingProducts = products.filter(p => !p.disposed);

  const statsCards = [
    {
      title: 'Points Balance',
      value: user.points.toLocaleString(),
      icon: Award,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      change: '+125 this week'
    },
    {
      title: 'Items Scanned',
      value: user.totalScanned.toString(),
      icon: Recycle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+5 today'
    },
    {
      title: 'Unpaid Fines',
      value: user.unpaidFines.toString(),
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: user.unpaidFines > 0 ? 'Pay by due date' : 'All clear!'
    },
    {
      title: 'Eco Score',
      value: Math.round((user.points / 10)).toString() + '%',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: 'Excellent rating'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-gray-600">Track your plastic footprint and earn rewards</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};