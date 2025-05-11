import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getComponents, 
  createComponent, 
  updateComponent, 
  deleteComponent,
  getComponentsByShipId 
} from '../utils/localStorageUtils';
import { Component } from '../types';

interface ComponentsContextType {
  components: Component[];
  loading: boolean;
  error: string | null;
  fetchComponents: () => void;
  getComponentById: (id: string) => Component | undefined;
  getComponentsByShip: (shipId: string) => Component[];
  addComponent: (component: Omit<Component, 'id' | 'createdAt' | 'updatedAt'>) => Component;
  editComponent: (id: string, component: Partial<Component>) => Component | undefined;
  removeComponent: (id: string) => boolean;
}

const ComponentsContext = createContext<ComponentsContextType | undefined>(undefined);

export const ComponentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComponents = () => {
    try {
      setLoading(true);
      const components = getComponents();
      setComponents(components);
      setError(null);
    } catch (err) {
      setError('Failed to fetch components');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  const getComponentById = (id: string): Component | undefined => {
    return components.find(component => component.id === id);
  };

  const getComponentsByShip = (shipId: string): Component[] => {
    return components.filter(component => component.shipId === shipId);
  };

  const addComponent = (componentData: Omit<Component, 'id' | 'createdAt' | 'updatedAt'>): Component => {
    try {
      const newComponent = createComponent(componentData);
      setComponents(prev => [...prev, newComponent]);
      return newComponent;
    } catch (err) {
      setError('Failed to add component');
      throw new Error('Failed to add component');
    }
  };

  const editComponent = (id: string, componentData: Partial<Component>): Component | undefined => {
    try {
      const updatedComponent = updateComponent(id, componentData);
      if (updatedComponent) {
        setComponents(prev => prev.map(component => component.id === id ? updatedComponent : component));
      }
      return updatedComponent;
    } catch (err) {
      setError('Failed to update component');
      return undefined;
    }
  };

  const removeComponent = (id: string): boolean => {
    try {
      const success = deleteComponent(id);
      if (success) {
        setComponents(prev => prev.filter(component => component.id !== id));
      }
      return success;
    } catch (err) {
      setError('Failed to delete component');
      return false;
    }
  };

  const value = {
    components,
    loading,
    error,
    fetchComponents,
    getComponentById,
    getComponentsByShip,
    addComponent,
    editComponent,
    removeComponent
  };

  return <ComponentsContext.Provider value={value}>{children}</ComponentsContext.Provider>;
};

export const useComponents = (): ComponentsContextType => {
  const context = useContext(ComponentsContext);
  if (context === undefined) {
    throw new Error('useComponents must be used within a ComponentsProvider');
  }
  return context;
};