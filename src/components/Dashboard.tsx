import React from 'react';
import { Users, Home, Cylinder, Package, Calendar, TrendingUp } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Household, Person, CylinderAssignment, BagDistribution, Visit } from '../types';

const Dashboard: React.FC = () => {
  const [households] = useLocalStorage<Household[]>('community_households', []);
  const [people] = useLocalStorage<Person[]>('community_people', []);
  const [cylinderAssignments] = useLocalStorage<CylinderAssignment[]>('community_cylinder_assignments', []);
  const [bagDistributions] = useLocalStorage<BagDistribution[]>('community_bag_distributions', []);
  const [visits] = useLocalStorage<Visit[]>('community_visits', []);

  const stats = [
    {
      name: 'Hogares Registrados',
      value: households.length,
      icon: Home,
      color: 'bg-blue-500',
      change: '+2.5%'
    },
    {
      name: 'Personas Registradas',
      value: people.length,
      icon: Users,
      color: 'bg-green-500',
      change: '+1.2%'
    },
    {
      name: 'Bombonas Asignadas',
      value: cylinderAssignments.filter(c => c.status === 'active').length,
      icon: Cylinder,
      color: 'bg-orange-500',
      change: '+0.8%'
    },
    {
      name: 'Bolsas Distribuidas',
      value: bagDistributions.length,
      icon: Package,
      color: 'bg-purple-500',
      change: '+5.2%'
    },
    {
      name: 'Visitas Este Mes',
      value: visits.filter(v => {
        const visitDate = new Date(v.visitDate);
        const now = new Date();
        return visitDate.getMonth() === now.getMonth() && visitDate.getFullYear() === now.getFullYear();
      }).length,
      icon: Calendar,
      color: 'bg-indigo-500',
      change: '+3.1%'
    }
  ];

  const recentActivities = [
    ...visits.slice(-5).map(visit => ({
      id: visit.id,
      type: 'visit',
      description: `Visita realizada a ${households.find(h => h.id === visit.householdId)?.address || 'Dirección desconocida'}`,
      date: visit.visitDate,
      icon: Calendar,
      color: 'text-indigo-600'
    })),
    ...bagDistributions.slice(-3).map(distribution => ({
      id: distribution.id,
      type: 'distribution',
      description: `Bolsa distribuida a ${households.find(h => h.id === distribution.householdId)?.address || 'Dirección desconocida'}`,
      date: distribution.distributedDate,
      icon: Package,
      color: 'text-purple-600'
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
        <p className="mt-2 text-gray-600">Resumen general del sistema de gestión comunitaria</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 ml-1">{stat.change}</span>
              <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Actividades Recientes</h2>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.date).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No hay actividades recientes</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <Home className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-blue-900">Nuevo Hogar</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <Users className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-green-900">Nueva Persona</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
              <Cylinder className="w-8 h-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-orange-900">Asignar Bombona</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <Package className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-purple-900">Distribuir Bolsa</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-2">Sistema de Gestión Comunitaria</h2>
        <p className="text-blue-100">
          Plataforma integral para la administración y seguimiento de recursos comunitarios.
          Mantenga un registro completo de hogares, familias, recursos y actividades de su comunidad.
        </p>
        <div className="mt-4 flex items-center space-x-6 text-sm text-blue-100">
          <span>Versión 1.0.0</span>
          <span>•</span>
          <span>Desarrollado para comunidades</span>
          <span>•</span>
          <span>Compatible con Windows 10</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;