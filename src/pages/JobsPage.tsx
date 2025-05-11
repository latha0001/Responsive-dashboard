import React from 'react';
import Layout from '../components/Layout/Layout';

const JobsPage = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Jobs</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Jobs management interface will be implemented here.</p>
        </div>
      </div>
    </Layout>
  );
};

export default JobsPage;