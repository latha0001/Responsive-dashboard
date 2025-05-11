import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Card from '../components/UI/Card';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useShips } from '../contexts/ShipsContext';

function ShipDetailPage() {
  const { shipId } = useParams();
  const { ships, loading } = useShips();
  
  const ship = ships.find(s => s.id === shipId);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (!ship) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ship Not Found</h2>
          <p className="text-gray-600">The requested ship could not be found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{ship.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Ship Details</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-600">Registration:</span>
                <span className="ml-2">{ship.registration}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Type:</span>
                <span className="ml-2">{ship.type}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Status:</span>
                <span className="ml-2">{ship.status}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Maintenance History</h2>
            {ship.maintenanceHistory?.length ? (
              <ul className="space-y-3">
                {ship.maintenanceHistory.map((record, index) => (
                  <li key={index} className="border-b pb-2 last:border-0">
                    <div className="font-medium">{record.date}</div>
                    <div className="text-gray-600">{record.description}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No maintenance history available.</p>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default ShipDetailPage;