import React, { useState, createContext } from 'react';
import { AuthContext, useAuthProvider } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import LoginForm from './components/auth/LoginForm';
import PasswordRecovery from './components/auth/PasswordRecovery';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import HouseholdList from './components/households/HouseholdList';
import Reports from './components/Reports';
import ToastContainer from './components/ToastContainer';

function App() {
  const authProvider = useAuthProvider();
  const { toasts, addToast, removeToast } = useToast();
  const [authView, setAuthView] = useState<'login' | 'recovery'>('login');
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderContent = () => {
    switch (currentPage) {
      case 'households':
        return <HouseholdList onShowToast={addToast} />;
      case 'reports':
        return <Reports onShowToast={addToast} />;
      case 'cylinders':
      case 'bags':
      case 'notifications':
      case 'visits':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {currentPage === 'cylinders' && 'Gestión de Bombonas'}
              {currentPage === 'bags' && 'Gestión de Bolsas'}
              {currentPage === 'notifications' && 'Notificaciones'}
              {currentPage === 'visits' && 'Registro de Visitas'}
            </h2>
            <p className="text-gray-600">Esta sección estará disponible próximamente</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  if (!authProvider.user) {
    return (
      <AuthContext.Provider value={authProvider}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
          <ToastContainer toasts={toasts} onRemove={removeToast} />
          {authView === 'login' ? (
            <LoginForm
              onSwitchToRecovery={() => setAuthView('recovery')}
              onLoginSuccess={() => addToast('Bienvenido al sistema', 'success')}
              onShowToast={addToast}
            />
          ) : (
            <PasswordRecovery
              onBack={() => setAuthView('login')}
              onShowToast={addToast}
            />
          )}
        </div>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={authProvider}>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderContent()}
      </Layout>
    </AuthContext.Provider>
  );
}

export default App;