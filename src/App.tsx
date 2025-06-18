import React from 'react';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { PurchaseScanner } from './components/PurchaseScanner';
import { DisposalScanner } from './components/DisposalScanner';
import { Points } from './components/Points';
import { Fines } from './components/Fines';
import { useApp } from './hooks/useApp';

function App() {
  const {
    currentUser,
    currentView,
    setCurrentView,
    products,
    fines,
    isScanning,
    setIsScanning,
    scanProduct,
    handleLogin,
    handleLogout
  } = useApp();

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={currentUser} products={products} onViewChange={setCurrentView} />;
      case 'purchase':
        return (
          <PurchaseScanner 
            onScan={(barcode) => scanProduct(barcode, 'purchase')} 
            isScanning={isScanning} 
            onScanningChange={setIsScanning} 
          />
        );
      case 'disposal':
        return (
          <DisposalScanner 
            onScan={(barcode) => scanProduct(barcode, 'disposal')} 
            isScanning={isScanning} 
            onScanningChange={setIsScanning} 
          />
        );
      case 'points':
        return <Points user={currentUser} />;
      case 'fines':
        return <Fines user={currentUser} fines={fines} />;
      default:
        return <Dashboard user={currentUser} products={products} onViewChange={setCurrentView} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onViewChange={setCurrentView}
      userType={currentUser.type}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;