import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getJobs, 
  createJob, 
  updateJob, 
  deleteJob,
  getJobsByShipId,
  getJobsByComponentId 
} from '../utils/localStorageUtils';
import { Job } from '../types';

interface JobsContextType {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  fetchJobs: () => void;
  getJobById: (id: string) => Job | undefined;
  getJobsByShip: (shipId: string) => Job[];
  getJobsByComponent: (componentId: string) => Job[];
  addJob: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => Job;
  editJob: (id: string, job: Partial<Job>) => Job | undefined;
  removeJob: (id: string) => boolean;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const JobsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = () => {
    try {
      setLoading(true);
      const jobs = getJobs();
      setJobs(jobs);
      setError(null);
    } catch (err) {
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const getJobById = (id: string): Job | undefined => {
    return jobs.find(job => job.id === id);
  };

  const getJobsByShip = (shipId: string): Job[] => {
    return jobs.filter(job => job.shipId === shipId);
  };

  const getJobsByComponent = (componentId: string): Job[] => {
    return jobs.filter(job => job.componentId === componentId);
  };

  const addJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Job => {
    try {
      const newJob = createJob(jobData);
      setJobs(prev => [...prev, newJob]);
      return newJob;
    } catch (err) {
      setError('Failed to add job');
      throw new Error('Failed to add job');
    }
  };

  const editJob = (id: string, jobData: Partial<Job>): Job | undefined => {
    try {
      const updatedJob = updateJob(id, jobData);
      if (updatedJob) {
        setJobs(prev => prev.map(job => job.id === id ? updatedJob : job));
      }
      return updatedJob;
    } catch (err) {
      setError('Failed to update job');
      return undefined;
    }
  };

  const removeJob = (id: string): boolean => {
    try {
      const success = deleteJob(id);
      if (success) {
        setJobs(prev => prev.filter(job => job.id !== id));
      }
      return success;
    } catch (err) {
      setError('Failed to delete job');
      return false;
    }
  };

  const value = {
    jobs,
    loading,
    error,
    fetchJobs,
    getJobById,
    getJobsByShip,
    getJobsByComponent,
    addJob,
    editJob,
    removeJob
  };

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
};

export const useJobs = (): JobsContextType => {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};