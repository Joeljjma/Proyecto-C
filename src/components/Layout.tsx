import React, { ReactNode } from 'react';
import { Home, Users, Cylinder, Package, Bell, Calendar, LogOut, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Inicio', icon: Home, key: 'dashboard' },
    { name: 'Hogares', icon: Users, key: 'households' },
    { name: 'Bombonas', icon: Cylinder, key: 'cylinders' },
    { name: 'Bolsas', icon: Package, key: 'bags' },
    { name: 'Notificaciones', icon: Bell, key: 'notifications' },
    { name: 'Visitas', icon: Calendar, key: 'visits' },
    { name: 'Reportes', icon: FileText, key: 'reports' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-16 bg-blue-600">
          <h1 className="text-white text-xl font-bold">Sistema Comunitario</h1>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 mb-4">
            <p className="text-sm text-gray-600">Bienvenido,</p>
            <p className="font-medium text-gray-900">{user?.name}</p>
          </div>
          
          {navigation.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`w-full flex items-center px-6 py-3 text-left text-sm font-medium transition-colors ${
                currentPage === item.key
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </button>
          ))}
          
          <button
            onClick={logout}
            className="w-full flex items-center px-6 py-3 mt-8 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Cerrar Sesión
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;