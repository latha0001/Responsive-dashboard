import React, { createContext, useContext, useState, useEffect } from 'react';
import { getShips, createShip, updateShip, deleteShip } from '../utils/localStorageUtils';
import { Ship } from '../types';

interface ShipsContextType {
  ships: Ship[];
  loading: boolean;
  error: string | null;
  fetchShips: () => void;
  getShipById: (id: string) => Ship | undefined;
  addShip: (ship: Omit<Ship, 'id' | 'createdAt' | 'updatedAt'>) => Ship;
  editShip: (id: string, ship: Partial<Ship>) => Ship | undefined;
  removeShip: (id: string) => boolean;
}

const ShipsContext = createContext<ShipsContextType | undefined>(undefined);

export const ShipsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ships, setShips] = useState<Ship[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShips = () => {
    try {
      setLoading(true);
      const ships = getShips();
      setShips(ships);
      setError(null);
    } catch (err) {
      setError('Failed to fetch ships');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShips();
  }, []);

  const getShipById = (id: string): Ship | undefined => {
    return ships.find(ship => ship.id === id);
  };

  const addShip = (shipData: Omit<Ship, 'id' | 'createdAt' | 'updatedAt'>): Ship => {
    try {
      const newShip = createShip(shipData);
      setShips(prev => [...prev, newShip]);
      return newShip;
    } catch (err) {
      setError('Failed to add ship');
      throw new Error('Failed to add ship');
    }
  };

  const editShip = (id: string, shipData: Partial<Ship>): Ship | undefined => {
    try {
      const updatedShip = updateShip(id, shipData);
      if (updatedShip) {
        setShips(prev => prev.map(ship => ship.id === id ? updatedShip : ship));
      }
      return updatedShip;
    } catch (err) {
      setError('Failed to update ship');
      return undefined;
    }
  };

  const removeShip = (id: string): boolean => {
    try {
      const success = deleteShip(id);
      if (success) {
        setShips(prev => prev.filter(ship => ship.id !== id));
      }
      return success;
    } catch (err) {
      setError('Failed to delete ship');
      return false;
    }
  };

  const value = {
    ships,
    loading,
    error,
    fetchShips,
    getShipById,
    addShip,
    editShip,
    removeShip
  };

  return <ShipsContext.Provider value={value}>{children}</ShipsContext.Provider>;
};

export const useShips = (): ShipsContextType => {
  const context = useContext(ShipsContext);
  if (context === undefined) {
    throw new Error('useShips must be used within a ShipsProvider');
  }
  return context;
};