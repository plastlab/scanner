import React from 'react';
import { 
  Home, 
  Award, 
  AlertCircle, 
  Users, 
  Settings,
  Camera,
  Recycle,
  ShoppingCart,
  Trash2,
  LogOut
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
  userType: 'consumer' | 'worker' | 'admin';
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  onViewChange, 
  userType,
  onLogout
}) => {
  const getNavItems = () => {
    switch (userType) {
      case 'consumer':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'purchase', label: 'Purchase', icon: ShoppingCart },
          { id: 'disposal', label: 'Dispose', icon: Trash2 },
          { id: 'points', label: 'Points', icon: Award },
          { id: 'fines', label: 'Fines', icon: AlertCircle },
        ];
      case 'worker':
        return [
          { id: 'worker-dashboard', label: 'Dashboard', icon: Home },
          { id: 'scanner', label: 'Scanner', icon: Camera },
          { id: 'earnings', label: 'Earnings', icon: Award },
          { id: 'cleanup', label: 'Cleanup', icon: Recycle },
        ];
      case 'admin':
        return [
          { id: 'admin-dashboard', label: 'Dashboard', icon: Home },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'analytics', label: 'Analytics', icon: Award },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      {/* Header with Logout */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Recycle className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">PlastLab scanner</span>
          </div>
          <button
            onClick={onLogout}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="pb-20">
        {children}
      </div>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 shadow-lg">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};