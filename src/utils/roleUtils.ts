import { UserRole } from '../types';

// Define permissions for different features based on user roles
type Permission = 'view' | 'create' | 'update' | 'delete';
type Feature = 'ships' | 'components' | 'jobs' | 'users' | 'dashboard' | 'calendar';

interface PermissionMap {
  [key: string]: {
    [key in Feature]?: Permission[];
  };
}

const rolePermissions: PermissionMap = {
  Admin: {
    ships: ['view', 'create', 'update', 'delete'],
    components: ['view', 'create', 'update', 'delete'],
    jobs: ['view', 'create', 'update', 'delete'],
    users: ['view', 'create', 'update', 'delete'],
    dashboard: ['view'],
    calendar: ['view']
  },
  Inspector: {
    ships: ['view'],
    components: ['view', 'create', 'update'],
    jobs: ['view', 'create', 'update'],
    dashboard: ['view'],
    calendar: ['view']
  },
  Engineer: {
    ships: ['view'],
    components: ['view'],
    jobs: ['view', 'update'],
    dashboard: ['view'],
    calendar: ['view']
  }
};

// Check if a user has a specific permission for a feature
export const hasPermission = (
  role: UserRole | undefined,
  feature: Feature,
  permission: Permission
): boolean => {
  if (!role) return false;
  
  const permissions = rolePermissions[role]?.[feature];
  return permissions ? permissions.includes(permission) : false;
};

// Get all features a user has access to
export const getUserFeatures = (role: UserRole | undefined): Feature[] => {
  if (!role) return [];
  
  return Object.entries(rolePermissions[role] || {})
    .filter(([, permissions]) => permissions && permissions.length > 0)
    .map(([feature]) => feature as Feature);
};

// Format role for display
export const formatRole = (role: string): string => {
  switch (role) {
    case 'Admin':
      return 'Administrator';
    case 'Inspector':
      return 'Ship Inspector';
    case 'Engineer':
      return 'Marine Engineer';
    default:
      return role;
  }
};