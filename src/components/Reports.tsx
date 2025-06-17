import React from 'react';
import { FileText, Download, Users, Home, Cylinder, Package, Calendar } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Household, Person, CylinderAssignment, BagDistribution, Visit } from '../types';
import {
  generateHouseholdsPDF,
  generatePeoplePDF,
  generateCylinderAssignmentsPDF,
  generateBagDistributionsPDF,
  generateVisitsPDF
} from '../utils/pdfGenerator';

interface ReportsProps {
  onShowToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

const Reports: React.FC<ReportsProps> = ({ onShowToast }) => {
  const [households] = useLocalStorage<Household[]>('community_households', []);
  const [people] = useLocalStorage<Person[]>('community_people', []);
  const [cylinderAssignments] = useLocalStorage<CylinderAssignment[]>('community_cylinder_assignments', []);
  const [bagDistributions] = useLocalStorage<BagDistribution[]>('community_bag_distributions', []);
  const [visits] = useLocalStorage<Visit[]>('community_visits', []);

  const reports = [
    {
      id: 'households',
      title: 'Reporte de Hogares',
      description: 'Lista completa de todos los hogares registrados',
      icon: Home,
      color: 'bg-blue-500',
      count: households.length,
      action: () => {
        if (households.length === 0) {
          onShowToast('No hay hogares registrados para generar el reporte', 'warning');
          return;
        }
        generateHouseholdsPDF(households, people);
        onShowToast('Reporte de hogares generado exitosamente', 'success');
      }
    },
    {
      id: 'people',
      title: 'Reporte de Personas',
      description: 'Lista de todas las personas registradas por hogar',
      icon: Users,
      color: 'bg-green-500',
      count: people.length,
      action: () => {
        if (people.length === 0) {
          onShowToast('No hay personas registradas para generar el reporte', 'warning');
          return;
        }
        generatePeoplePDF(people, households);
        onShowToast('Reporte de personas generado exitosamente', 'success');
      }
    },
    {
      id: 'cylinders',
      title: 'Reporte de Bombonas',
      description: 'Historial de asignaciones y devoluciones de bombonas',
      icon: Cylinder,
      color: 'bg-orange-500',
      count: cylinderAssignments.length,
      action: () => {
        if (cylinderAssignments.length === 0) {
          onShowToast('No hay asignaciones de bombonas para generar el reporte', 'warning');
          return;
        }
        generateCylinderAssignmentsPDF(cylinderAssignments, households);
        onShowToast('Reporte de bombonas generado exitosamente', 'success');
      }
    },
    {
      id: 'bags',
      title: 'Reporte de Bolsas',
      description: 'Registro de distribución de bolsas de alimentos y medicinas',
      icon: Package,
      color: 'bg-purple-500',
      count: bagDistributions.length,
      action: () => {
        if (bagDistributions.length === 0) {
          onShowToast('No hay distribuciones de bolsas para generar el reporte', 'warning');
          return;
        }
        generateBagDistributionsPDF(bagDistributions, households);
        onShowToast('Reporte de bolsas generado exitosamente', 'success');
      }
    },
    {
      id: 'visits',
      title: 'Reporte de Visitas',
      description: 'Historial de visitas comunitarias realizadas',
      icon: Calendar,
      color: 'bg-indigo-500',
      count: visits.length,
      action: () => {
        if (visits.length === 0) {
          onShowToast('No hay visitas registradas para generar el reporte', 'warning');
          return;
        }
        generateVisitsPDF(visits, households);
        onShowToast('Reporte de visitas generado exitosamente', 'success');
      }
    }
  ];

  const generateAllReports = () => {
    let generatedCount = 0;
    
    reports.forEach(report => {
      if (report.count > 0) {
        report.action();
        generatedCount++;
      }
    });

    if (generatedCount === 0) {
      onShowToast('No hay datos suficientes para generar reportes', 'warning');
    } else {
      onShowToast(`${generatedCount} reportes generados exitosamente`, 'success');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes del Sistema</h1>
          <p className="mt-2 text-gray-600">Genere y descargue reportes en formato PDF</p>
        </div>
        <button
          onClick={generateAllReports}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Generar Todos</span>
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`${report.color} p-3 rounded-lg`}>
                <report.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{report.count}</span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{report.description}</p>
            
            <button
              onClick={report.action}
              disabled={report.count === 0}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                report.count > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Generar PDF</span>
            </button>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Resumen de Datos</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{households.length}</div>
            <div className="text-sm text-blue-100">Hogares</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{people.length}</div>
            <div className="text-sm text-blue-100">Personas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{cylinderAssignments.length}</div>
            <div className="text-sm text-blue-100">Asignaciones</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{bagDistributions.length}</div>
            <div className="text-sm text-blue-100">Distribuciones</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{visits.length}</div>
            <div className="text-sm text-blue-100">Visitas</div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Instrucciones</h3>
        <ul className="list-disc list-inside text-blue-800 space-y-2">
          <li>Haga clic en "Generar PDF" para descargar un reporte específico</li>
          <li>Use "Generar Todos" para crear todos los reportes disponibles de una vez</li>
          <li>Los reportes solo se generarán si hay datos disponibles</li>
          <li>Los archivos se descargarán automáticamente en formato PDF</li>
          <li>Todos los reportes incluyen la fecha de generación</li>
        </ul>
      </div>
    </div>
  );
};

export default Reports;