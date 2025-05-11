import React from 'react';
import Layout from '../components/Layout/Layout';
import Card from '../components/UI/Card';
import { Calendar } from 'lucide-react';

const CalendarPage: React.FC = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        </div>
        
        <Card>
          <div className="p-4">
            <p className="text-gray-600">Calendar functionality will be implemented here.</p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default CalendarPage;