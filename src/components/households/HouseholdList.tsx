import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Users, Phone, MapPin } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Household, Person } from '../../types';
import Modal from '../Modal';
import HouseholdForm from './HouseholdForm';

interface HouseholdListProps {
  onShowToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

const HouseholdList: React.FC<HouseholdListProps> = ({ onShowToast }) => {
  const [households, setHouseholds] = useLocalStorage<Household[]>('community_households', []);
  const [people] = useLocalStorage<Person[]>('community_people', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHousehold, setEditingHousehold] = useState<Household | null>(null);

  const filteredHouseholds = households.filter(household =>
    household.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    household.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    household.phone.includes(searchTerm)
  );

  const handleAddHousehold = () => {
    setEditingHousehold(null);
    setIsModalOpen(true);
  };

  const handleEditHousehold = (household: Household) => {
    setEditingHousehold(household);
    setIsModalOpen(true);
  };

  const handleDeleteHousehold = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este hogar?')) {
      setHouseholds(households.filter(h => h.id !== id));
      onShowToast('Hogar eliminado exitosamente', 'success');
    }
  };

  const handleSaveHousehold = (householdData: Omit<Household, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingHousehold) {
      setHouseholds(households.map(h => 
        h.id === editingHousehold.id 
          ? { ...h, ...householdData, updatedAt: new Date() }
          : h
      ));
      onShowToast('Hogar actualizado exitosamente', 'success');
    } else {
      const newHousehold: Household = {
        id: Date.now().toString(),
        ...householdData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setHouseholds([...households, newHousehold]);
      onShowToast('Hogar agregado exitosamente', 'success');
    }
    setIsModalOpen(false);
  };

  const getHeadOfFamily = (householdId: string) => {
    const head = people.find(p => p.householdId === householdId && p.isHeadOfFamily);
    return head ? `${head.firstName} ${head.lastName}` : 'No definido';
  };

  const getFamilyMembers = (householdId: string) => {
    return people.filter(p => p.householdId === householdId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Hogares</h1>
          <p className="mt-2 text-gray-600">Administre los hogares registrados en la comunidad</p>
        </div>
        <button
          onClick={handleAddHousehold}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Hogar</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por dirección, ubicación o teléfono..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Households Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredHouseholds.map((household) => (
          <div key={household.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{household.address}</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {household.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {household.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {getFamilyMembers(household.id)} miembros
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditHousehold(household)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteHousehold(household.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Jefe de familia:</span>
                <span className="font-medium text-gray-900">{getHeadOfFamily(household.id)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHouseholds.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron hogares</h3>
          <p className="text-gray-500">
            {searchTerm ? 'No hay hogares que coincidan con su búsqueda.' : 'Comience agregando un nuevo hogar.'}
          </p>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingHousehold ? 'Editar Hogar' : 'Nuevo Hogar'}
        size="lg"
      >
        <HouseholdForm
          household={editingHousehold}
          onSave={handleSaveHousehold}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default HouseholdList;