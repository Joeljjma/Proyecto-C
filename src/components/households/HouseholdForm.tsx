import React, { useState, useEffect } from 'react';
import { Household } from '../../types';

interface HouseholdFormProps {
  household: Household | null;
  onSave: (household: Omit<Household, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const HouseholdForm: React.FC<HouseholdFormProps> = ({ household, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    location: '',
    headOfFamily: '',
    totalMembers: 1
  });

  useEffect(() => {
    if (household) {
      setFormData({
        address: household.address,
        phone: household.phone,
        location: household.location,
        headOfFamily: household.headOfFamily,
        totalMembers: household.totalMembers
      });
    }
  }, [household]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'totalMembers' ? parseInt(value) || 1 : value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Dirección *
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Calle 123, Casa 45"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: +58 412-1234567"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Ubicación/Sector *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Sector Centro, Barrio San José"
          />
        </div>

        <div>
          <label htmlFor="totalMembers" className="block text-sm font-medium text-gray-700 mb-2">
            Total de Miembros *
          </label>
          <input
            type="number"
            id="totalMembers"
            name="totalMembers"
            value={formData.totalMembers}
            onChange={handleChange}
            min="1"
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="headOfFamily" className="block text-sm font-medium text-gray-700 mb-2">
            Jefe de Familia
          </label>
          <input
            type="text"
            id="headOfFamily"
            name="headOfFamily"
            value={formData.headOfFamily}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nombre completo del jefe de familia"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
        >
          {household ? 'Actualizar' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

export default HouseholdForm;