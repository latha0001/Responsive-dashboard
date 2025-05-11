import React from 'react';
import { useShips } from '../../contexts/ShipsContext';
import { Ship } from '../../types';
import { useForm } from 'react-hook-form';
import Button from '../UI/Button';
import { Save, X } from 'lucide-react';

interface ShipFormProps {
  ship: Ship | null;
  onCancel: () => void;
}

type ShipFormData = {
  name: string;
  imo: string;
  flag: string;
  status: 'Active' | 'Under Maintenance' | 'Out of Service';
};

const ShipForm: React.FC<ShipFormProps> = ({ ship, onCancel }) => {
  const { addShip, editShip } = useShips();
  const isEditing = !!ship;
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<ShipFormData>({
    defaultValues: ship ? {
      name: ship.name,
      imo: ship.imo,
      flag: ship.flag,
      status: ship.status
    } : {
      name: '',
      imo: '',
      flag: '',
      status: 'Active'
    }
  });

  const onSubmit = async (data: ShipFormData) => {
    try {
      if (isEditing && ship) {
        await editShip(ship.id, data);
      } else {
        await addShip(data);
      }
      onCancel();
    } catch (error) {
      console.error('Failed to save ship', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {isEditing ? 'Edit Ship' : 'Add New Ship'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Ship Name*
          </label>
          <input
            id="name"
            type="text"
            {...register('name', { 
              required: 'Ship name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' }
            })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="imo" className="block text-sm font-medium text-gray-700 mb-1">
            IMO Number*
          </label>
          <input
            id="imo"
            type="text"
            {...register('imo', { 
              required: 'IMO number is required',
              pattern: { 
                value: /^[0-9]{7}$/, 
                message: 'IMO must be a 7-digit number' 
              }
            })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.imo ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.imo && (
            <p className="mt-1 text-sm text-red-600">{errors.imo.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="flag" className="block text-sm font-medium text-gray-700 mb-1">
            Flag*
          </label>
          <input
            id="flag"
            type="text"
            {...register('flag', { 
              required: 'Flag is required'
            })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.flag ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.flag && (
            <p className="mt-1 text-sm text-red-600">{errors.flag.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status*
          </label>
          <select
            id="status"
            {...register('status', { required: 'Status is required' })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.status ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="Active">Active</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Out of Service">Out of Service</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          startIcon={<X className="h-4 w-4" />}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          startIcon={!isSubmitting && <Save className="h-4 w-4" />}
        >
          {isEditing ? 'Update Ship' : 'Add Ship'}
        </Button>
      </div>
    </form>
  );
};

export default ShipForm;