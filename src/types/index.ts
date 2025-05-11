export type UserRole = 'Admin' | 'Inspector' | 'Engineer';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface Ship {
  id: string;
  name: string;
  imo: string;
  flag: string;
  status: 'Active' | 'Under Maintenance' | 'Out of Service';
  createdAt: string;
  updatedAt: string;
}

export interface Component {
  id: string;
  shipId: string;
  name: string;
  serialNumber: string;
  installDate: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate?: string;
  status: 'Operational' | 'Maintenance Required' | 'Failed';
  createdAt: string;
  updatedAt: string;
}

export type JobPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type JobStatus = 'Open' | 'In Progress' | 'Completed' | 'Cancelled';
export type JobType = 'Inspection' | 'Repair' | 'Replacement' | 'Maintenance';

export interface Job {
  id: string;
  shipId: string;
  componentId: string;
  type: JobType;
  priority: JobPriority;
  status: JobStatus;
  assignedEngineerId: string;
  scheduledDate: string;
  completionDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 'Job Created' | 'Job Updated' | 'Job Completed';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  entityId: string; // ID of related ship, component or job
  createdAt: string;
}

export interface KPIData {
  totalShips: number;
  overdueMaintenance: number;
  jobsInProgress: number;
  jobsCompleted: number;
  shipsByStatus: Record<string, number>;
  jobsByPriority: Record<string, number>;
  jobsByStatus: Record<string, number>;
  jobsCompletedByMonth: Record<string, number>;
}