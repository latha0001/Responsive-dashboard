import React, { useEffect, useState } from 'react';
import { useShips } from '../contexts/ShipsContext';
import { useComponents } from '../contexts/ComponentsContext';
import { useJobs } from '../contexts/JobsContext';
import { Anchor, PenTool as Tool, Ship, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from '../components/UI/Card';
import { isPastDate, groupDatesByMonth } from '../utils/dateUtils';
import { KPIData } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage: React.FC = () => {
  const { ships, loading: shipsLoading } = useShips();
  const { components, loading: componentsLoading } = useComponents();
  const { jobs, loading: jobsLoading } = useJobs();
  const [kpiData, setKpiData] = useState<KPIData>({
    totalShips: 0,
    overdueMaintenance: 0,
    jobsInProgress: 0,
    jobsCompleted: 0,
    shipsByStatus: {},
    jobsByPriority: {},
    jobsByStatus: {},
    jobsCompletedByMonth: {}
  });

  useEffect(() => {
    if (shipsLoading || componentsLoading || jobsLoading) return;

    // Calculate KPIs
    const overdueComponents = components.filter(component => 
      component.nextMaintenanceDate && isPastDate(component.nextMaintenanceDate)
    );
    
    const jobsInProgress = jobs.filter(job => job.status === 'In Progress');
    const jobsCompleted = jobs.filter(job => job.status === 'Completed');

    // Group ships by status
    const shipsByStatus = ships.reduce((acc, ship) => {
      acc[ship.status] = (acc[ship.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group jobs by priority
    const jobsByPriority = jobs.reduce((acc, job) => {
      acc[job.priority] = (acc[job.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group jobs by status
    const jobsByStatus = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group completed jobs by month
    const completedDates = jobsCompleted.map(job => job.completionDate || job.updatedAt);
    const jobsCompletedByMonth = groupDatesByMonth(completedDates);

    setKpiData({
      totalShips: ships.length,
      overdueMaintenance: overdueComponents.length,
      jobsInProgress: jobsInProgress.length,
      jobsCompleted: jobsCompleted.length,
      shipsByStatus,
      jobsByPriority,
      jobsByStatus,
      jobsCompletedByMonth
    });
  }, [ships, components, jobs, shipsLoading, componentsLoading, jobsLoading]);

  const loading = shipsLoading || componentsLoading || jobsLoading;

  // Chart data for ship status
  const shipStatusChartData = {
    labels: Object.keys(kpiData.shipsByStatus),
    datasets: [
      {
        data: Object.values(kpiData.shipsByStatus),
        backgroundColor: [
          'rgba(15, 52, 96, 0.8)',
          'rgba(26, 98, 153, 0.8)',
          'rgba(233, 69, 96, 0.8)',
        ],
        borderColor: [
          'rgba(15, 52, 96, 1)',
          'rgba(26, 98, 153, 1)',
          'rgba(233, 69, 96, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for jobs by status
  const jobStatusChartData = {
    labels: Object.keys(kpiData.jobsByStatus),
    datasets: [
      {
        data: Object.values(kpiData.jobsByStatus),
        backgroundColor: [
          'rgba(251, 191, 36, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(251, 191, 36, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for completed jobs over time
  const monthlyJobsChartData = {
    labels: Object.keys(kpiData.jobsCompletedByMonth),
    datasets: [
      {
        label: 'Completed Jobs',
        data: Object.values(kpiData.jobsCompletedByMonth),
        backgroundColor: 'rgba(26, 98, 153, 0.7)',
        borderColor: 'rgba(26, 98, 153, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Ships */}
        <Card className="animate-fade-in" hover>
          <CardContent className="flex items-start">
            <div className="p-3 rounded-full bg-primary-100 mr-4">
              <Ship className="h-6 w-6 text-primary-500" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Ships</p>
              {loading ? <LoadingSpinner size="small" /> : (
                <p className="text-2xl font-bold text-gray-800">{kpiData.totalShips}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Overdue Maintenance */}
        <Card className="animate-fade-in delay-100" hover>
          <CardContent className="flex items-start">
            <div className="p-3 rounded-full bg-red-100 mr-4">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Overdue Maintenance</p>
              {loading ? <LoadingSpinner size="small" /> : (
                <p className="text-2xl font-bold text-gray-800">{kpiData.overdueMaintenance}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Jobs In Progress */}
        <Card className="animate-fade-in delay-200" hover>
          <CardContent className="flex items-start">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <Tool className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Jobs In Progress</p>
              {loading ? <LoadingSpinner size="small" /> : (
                <p className="text-2xl font-bold text-gray-800">{kpiData.jobsInProgress}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Completed Jobs */}
        <Card className="animate-fade-in delay-300" hover>
          <CardContent className="flex items-start">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Completed Jobs</p>
              {loading ? <LoadingSpinner size="small" /> : (
                <p className="text-2xl font-bold text-gray-800">{kpiData.jobsCompleted}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ships by Status */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Anchor className="h-5 w-5 mr-2 text-primary-500" />
              Ships by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <div className="h-64">
                <Doughnut 
                  data={shipStatusChartData} 
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Jobs by Status */}
        <Card className="animate-slide-up delay-100">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Tool className="h-5 w-5 mr-2 text-primary-500" />
              Jobs by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <div className="h-64">
                <Doughnut 
                  data={jobStatusChartData} 
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Completed Jobs Over Time */}
      <Card className="animate-slide-up delay-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary-500" />
            Completed Jobs Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            <div className="h-64">
              <Bar 
                data={monthlyJobsChartData} 
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  }
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;