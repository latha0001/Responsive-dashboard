import { User, Ship, Component, Job, Notification } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Initial data
const initialUsers: User[] = [
  { id: '1', role: 'Admin', email: 'admin@entnt.in', password: 'admin123' },
  { id: '2', role: 'Inspector', email: 'inspector@entnt.in', password: 'inspect123' },
  { id: '3', role: 'Engineer', email: 'engineer@entnt.in', password: 'engine123' }
];

const initialShips: Ship[] = [
  { 
    id: 's1', 
    name: 'Ever Given', 
    imo: '9811000', 
    flag: 'Panama', 
    status: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 's2', 
    name: 'Maersk Alabama', 
    imo: '9164263', 
    flag: 'USA', 
    status: 'Under Maintenance',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const initialComponents: Component[] = [
  { 
    id: 'c1', 
    shipId: 's1', 
    name: 'Main Engine', 
    serialNumber: 'ME-1234',
    installDate: '2020-01-10', 
    lastMaintenanceDate: '2024-03-12',
    nextMaintenanceDate: '2024-09-12',
    status: 'Operational',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 'c2', 
    shipId: 's2', 
    name: 'Radar', 
    serialNumber: 'RAD-5678', 
    installDate: '2021-07-18', 
    lastMaintenanceDate: '2023-12-01',
    nextMaintenanceDate: '2024-06-01',
    status: 'Maintenance Required',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const initialJobs: Job[] = [
  { 
    id: 'j1', 
    componentId: 'c1', 
    shipId: 's1', 
    type: 'Inspection', 
    priority: 'High',
    status: 'Open', 
    assignedEngineerId: '3', 
    scheduledDate: '2025-05-05',
    notes: 'Regular inspection of main engine',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Initialize localStorage with initial data if it doesn't exist
export const initializeLocalStorage = (): void => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(initialUsers));
  }
  
  if (!localStorage.getItem('ships')) {
    localStorage.setItem('ships', JSON.stringify(initialShips));
  }
  
  if (!localStorage.getItem('components')) {
    localStorage.setItem('components', JSON.stringify(initialComponents));
  }
  
  if (!localStorage.getItem('jobs')) {
    localStorage.setItem('jobs', JSON.stringify(initialJobs));
  }
  
  if (!localStorage.getItem('notifications')) {
    localStorage.setItem('notifications', JSON.stringify([]));
  }
};

// Generic functions for managing localStorage data
export const getItem = <T>(key: string): T[] => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : [];
};

export const setItem = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// User related functions
export const getUsers = (): User[] => getItem<User>('users');

export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

// Ships related functions
export const getShips = (): Ship[] => getItem<Ship>('ships');

export const getShipById = (id: string): Ship | undefined => {
  const ships = getShips();
  return ships.find(ship => ship.id === id);
};

export const createShip = (ship: Omit<Ship, 'id' | 'createdAt' | 'updatedAt'>): Ship => {
  const newShip: Ship = {
    ...ship,
    id: `s${uuidv4()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const ships = getShips();
  setItem('ships', [...ships, newShip]);
  
  return newShip;
};

export const updateShip = (id: string, shipData: Partial<Ship>): Ship | undefined => {
  const ships = getShips();
  const index = ships.findIndex(ship => ship.id === id);
  
  if (index === -1) return undefined;
  
  const updatedShip: Ship = {
    ...ships[index],
    ...shipData,
    updatedAt: new Date().toISOString()
  };
  
  ships[index] = updatedShip;
  setItem('ships', ships);
  
  return updatedShip;
};

export const deleteShip = (id: string): boolean => {
  const ships = getShips();
  const filteredShips = ships.filter(ship => ship.id !== id);
  
  if (filteredShips.length === ships.length) return false;
  
  setItem('ships', filteredShips);
  
  // Also delete related components and jobs
  const components = getComponents();
  const filteredComponents = components.filter(component => component.shipId !== id);
  setItem('components', filteredComponents);
  
  const jobs = getJobs();
  const filteredJobs = jobs.filter(job => job.shipId !== id);
  setItem('jobs', filteredJobs);
  
  return true;
};

// Components related functions
export const getComponents = (): Component[] => getItem<Component>('components');

export const getComponentById = (id: string): Component | undefined => {
  const components = getComponents();
  return components.find(component => component.id === id);
};

export const getComponentsByShipId = (shipId: string): Component[] => {
  const components = getComponents();
  return components.filter(component => component.shipId === shipId);
};

export const createComponent = (component: Omit<Component, 'id' | 'createdAt' | 'updatedAt'>): Component => {
  const newComponent: Component = {
    ...component,
    id: `c${uuidv4()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const components = getComponents();
  setItem('components', [...components, newComponent]);
  
  return newComponent;
};

export const updateComponent = (id: string, componentData: Partial<Component>): Component | undefined => {
  const components = getComponents();
  const index = components.findIndex(component => component.id === id);
  
  if (index === -1) return undefined;
  
  const updatedComponent: Component = {
    ...components[index],
    ...componentData,
    updatedAt: new Date().toISOString()
  };
  
  components[index] = updatedComponent;
  setItem('components', components);
  
  return updatedComponent;
};

export const deleteComponent = (id: string): boolean => {
  const components = getComponents();
  const filteredComponents = components.filter(component => component.id !== id);
  
  if (filteredComponents.length === components.length) return false;
  
  setItem('components', filteredComponents);
  
  // Also delete related jobs
  const jobs = getJobs();
  const filteredJobs = jobs.filter(job => job.componentId !== id);
  setItem('jobs', filteredJobs);
  
  return true;
};

// Jobs related functions
export const getJobs = (): Job[] => getItem<Job>('jobs');

export const getJobById = (id: string): Job | undefined => {
  const jobs = getJobs();
  return jobs.find(job => job.id === id);
};

export const getJobsByShipId = (shipId: string): Job[] => {
  const jobs = getJobs();
  return jobs.filter(job => job.shipId === shipId);
};

export const getJobsByComponentId = (componentId: string): Job[] => {
  const jobs = getJobs();
  return jobs.filter(job => job.componentId === componentId);
};

export const createJob = (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Job => {
  const newJob: Job = {
    ...job,
    id: `j${uuidv4()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const jobs = getJobs();
  setItem('jobs', [...jobs, newJob]);
  
  // Create notification for new job
  createNotification({
    type: 'Job Created',
    message: `A new ${newJob.type} job has been created with ${newJob.priority} priority`,
    entityId: newJob.id,
    isRead: false
  });
  
  return newJob;
};

export const updateJob = (id: string, jobData: Partial<Job>): Job | undefined => {
  const jobs = getJobs();
  const index = jobs.findIndex(job => job.id === id);
  
  if (index === -1) return undefined;
  
  const updatedJob: Job = {
    ...jobs[index],
    ...jobData,
    updatedAt: new Date().toISOString()
  };
  
  jobs[index] = updatedJob;
  setItem('jobs', jobs);
  
  // Create notification for job update
  let notificationType: 'Job Updated' | 'Job Completed' = 'Job Updated';
  let message = `Job ${id} has been updated`;
  
  if (jobData.status === 'Completed' && jobs[index].status !== 'Completed') {
    notificationType = 'Job Completed';
    message = `Job ${id} has been completed`;
  }
  
  createNotification({
    type: notificationType,
    message,
    entityId: id,
    isRead: false
  });
  
  return updatedJob;
};

export const deleteJob = (id: string): boolean => {
  const jobs = getJobs();
  const filteredJobs = jobs.filter(job => job.id !== id);
  
  if (filteredJobs.length === jobs.length) return false;
  
  setItem('jobs', filteredJobs);
  return true;
};

// Notifications related functions
export const getNotifications = (): Notification[] => getItem<Notification>('notifications');

export const createNotification = (notification: Omit<Notification, 'id' | 'createdAt'>): Notification => {
  const newNotification: Notification = {
    ...notification,
    id: `n${uuidv4()}`,
    createdAt: new Date().toISOString()
  };
  
  const notifications = getNotifications();
  setItem('notifications', [newNotification, ...notifications]);
  
  return newNotification;
};

export const markNotificationAsRead = (id: string): Notification | undefined => {
  const notifications = getNotifications();
  const index = notifications.findIndex(notification => notification.id === id);
  
  if (index === -1) return undefined;
  
  const updatedNotification: Notification = {
    ...notifications[index],
    isRead: true
  };
  
  notifications[index] = updatedNotification;
  setItem('notifications', notifications);
  
  return updatedNotification;
};

export const markAllNotificationsAsRead = (): void => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notification => ({
    ...notification,
    isRead: true
  }));
  
  setItem('notifications', updatedNotifications);
};

export const deleteNotification = (id: string): boolean => {
  const notifications = getNotifications();
  const filteredNotifications = notifications.filter(notification => notification.id !== id);
  
  if (filteredNotifications.length === notifications.length) return false;
  
  setItem('notifications', filteredNotifications);
  return true;
};

// Session management
export const setSession = (user: User): void => {
  localStorage.setItem('session', JSON.stringify({
    userId: user.id,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
  }));
};

export const getSession = (): { userId: string, expiresAt: string } | null => {
  const session = localStorage.getItem('session');
  if (!session) return null;
  
  const parsedSession = JSON.parse(session);
  if (new Date(parsedSession.expiresAt) < new Date()) {
    localStorage.removeItem('session');
    return null;
  }
  
  return parsedSession;
};

export const clearSession = (): void => {
  localStorage.removeItem('session');
};