// Types for the Community Management System

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  role: 'admin' | 'coordinator' | 'volunteer';
  securityQuestion: string;
  securityAnswer: string;
  createdAt: Date;
}

export interface Household {
  id: string;
  address: string;
  phone: string;
  location: string;
  headOfFamily: string;
  totalMembers: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Person {
  id: string;
  householdId: string;
  firstName: string;
  lastName: string;
  identification: string;
  birthDate: Date;
  gender: 'male' | 'female' | 'other';
  relationship: string;
  isHeadOfFamily: boolean;
  phone?: string;
  email?: string;
  medicalConditions?: string;
  createdAt: Date;
}

export interface GasCylinder {
  id: string;
  serialNumber: string;
  capacity: number; // in kg
  status: 'available' | 'assigned' | 'maintenance' | 'retired';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  createdAt: Date;
  updatedAt: Date;
}

export interface CylinderAssignment {
  id: string;
  cylinderId: string;
  householdId: string;
  assignedDate: Date;
  returnedDate?: Date;
  status: 'active' | 'returned' | 'lost';
  notes?: string;
  assignedBy: string;
}

export interface Bag {
  id: string;
  type: 'fria' | 'seca'; // cold or dry
  contents: string;
  quantity: number;
  expirationDate?: Date;
  createdAt: Date;
}

export interface BagDistribution {
  id: string;
  bagId: string;
  householdId: string;
  distributedDate: Date;
  quantity: number;
  distributedBy: string;
  receivedBy: string;
  notes?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetType: 'all' | 'household' | 'individual';
  targetIds?: string[];
  createdBy: string;
  createdAt: Date;
  readBy: string[];
}

export interface Visit {
  id: string;
  householdId: string;
  visitDate: Date;
  visitType: 'routine' | 'emergency' | 'follow-up' | 'delivery';
  purpose: string;
  findings: string;
  actions: string;
  nextVisitDate?: Date;
  visitedBy: string;
  createdAt: Date;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  autoClose?: boolean;
}