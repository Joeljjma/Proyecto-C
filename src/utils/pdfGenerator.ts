import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Household, Person, CylinderAssignment, BagDistribution, Visit } from '../types';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: any;
  }
}

export const generateHouseholdsPDF = (households: Household[], people: Person[]) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Reporte de Hogares Registrados', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 20, 30);
  
  // Table data
  const tableData = households.map(household => {
    const headOfFamily = people.find(p => p.householdId === household.id && p.isHeadOfFamily);
    return [
      household.address,
      household.phone,
      household.location,
      headOfFamily ? `${headOfFamily.firstName} ${headOfFamily.lastName}` : 'No definido',
      household.totalMembers.toString()
    ];
  });

  doc.autoTable({
    head: [['Dirección', 'Teléfono', 'Ubicación', 'Jefe de Familia', 'Miembros']],
    body: tableData,
    startY: 40,
    styles: { fontSize: 8 }
  });

  doc.save('reporte-hogares.pdf');
};

export const generatePeoplePDF = (people: Person[], households: Household[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Reporte de Personas Registradas', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 20, 30);
  
  const tableData = people.map(person => {
    const household = households.find(h => h.id === person.householdId);
    return [
      `${person.firstName} ${person.lastName}`,
      person.identification,
      person.birthDate.toLocaleDateString('es-ES'),
      person.gender === 'male' ? 'M' : person.gender === 'female' ? 'F' : 'O',
      person.relationship,
      household ? household.address : 'Sin hogar'
    ];
  });

  doc.autoTable({
    head: [['Nombre', 'Identificación', 'Fecha Nac.', 'Género', 'Parentesco', 'Dirección']],
    body: tableData,
    startY: 40,
    styles: { fontSize: 8 }
  });

  doc.save('reporte-personas.pdf');
};

export const generateCylinderAssignmentsPDF = (assignments: CylinderAssignment[], households: Household[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Reporte de Asignaciones de Bombonas', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 20, 30);
  
  const tableData = assignments.map(assignment => {
    const household = households.find(h => h.id === assignment.householdId);
    return [
      assignment.cylinderId,
      household ? household.address : 'Sin dirección',
      assignment.assignedDate.toLocaleDateString('es-ES'),
      assignment.returnedDate ? assignment.returnedDate.toLocaleDateString('es-ES') : 'No devuelta',
      assignment.status === 'active' ? 'Activa' : assignment.status === 'returned' ? 'Devuelta' : 'Perdida'
    ];
  });

  doc.autoTable({
    head: [['ID Bombona', 'Dirección', 'Fecha Asignación', 'Fecha Devolución', 'Estado']],
    body: tableData,
    startY: 40,
    styles: { fontSize: 8 }
  });

  doc.save('reporte-bombonas.pdf');
};

export const generateBagDistributionsPDF = (distributions: BagDistribution[], households: Household[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Reporte de Distribución de Bolsas', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 20, 30);
  
  const tableData = distributions.map(distribution => {
    const household = households.find(h => h.id === distribution.householdId);
    return [
      household ? household.address : 'Sin dirección',
      distribution.quantity.toString(),
      distribution.distributedDate.toLocaleDateString('es-ES'),
      distribution.distributedBy,
      distribution.receivedBy
    ];
  });

  doc.autoTable({
    head: [['Dirección', 'Cantidad', 'Fecha Distribución', 'Distribuido por', 'Recibido por']],
    body: tableData,
    startY: 40,
    styles: { fontSize: 8 }
  });

  doc.save('reporte-bolsas.pdf');
};

export const generateVisitsPDF = (visits: Visit[], households: Household[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Reporte de Visitas Comunitarias', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 20, 30);
  
  const tableData = visits.map(visit => {
    const household = households.find(h => h.id === visit.householdId);
    return [
      household ? household.address : 'Sin dirección',
      visit.visitDate.toLocaleDateString('es-ES'),
      visit.visitType === 'routine' ? 'Rutinaria' : 
      visit.visitType === 'emergency' ? 'Emergencia' : 
      visit.visitType === 'follow-up' ? 'Seguimiento' : 'Entrega',
      visit.purpose,
      visit.visitedBy
    ];
  });

  doc.autoTable({
    head: [['Dirección', 'Fecha', 'Tipo', 'Propósito', 'Visitado por']],
    body: tableData,
    startY: 40,
    styles: { fontSize: 8 }
  });

  doc.save('reporte-visitas.pdf');
};