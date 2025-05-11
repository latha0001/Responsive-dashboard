import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useShips } from '../../contexts/ShipsContext';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../utils/roleUtils';
import { formatDate } from '../../utils/dateUtils';
import { Ship as ShipIcon, Plus, Search, Filter, Edit, Trash2, ArrowUpDown } from 'lucide-react';
import Button from '../UI/Button';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import LoadingSpinner from '../UI/LoadingSpinner';
import { Ship } from '../../types';
import ShipForm from './ShipForm';

const ShipList: React.FC = () => {
  const { ships, loading, error, removeShip } = useShips();
  const { user } = useAuth();
  const [showAddShipForm, setShowAddShipForm] = useState(false);
  const [editingShip, setEditingShip] = useState<Ship | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortField, setSortField] = useState<keyof Ship>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const canCreateShip = hasPermission(user?.role, 'ships', 'create');
  const canUpdateShip = hasPermission(user?.role, 'ships', 'update');
  const canDeleteShip = hasPermission(user?.role, 'ships', 'delete');

  // Reset form state when ships change
  useEffect(() => {
    if (!loading) {
      setShowAddShipForm(false);
      setEditingShip(null);
    }
  }, [ships, loading]);

  // Sort and filter ships
  const filteredShips = ships.filter(ship => {
    const matchesSearch = 
      ship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ship.imo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ship.flag.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? ship.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  const sortedShips = [...filteredShips].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof Ship) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Under Maintenance':
        return 'warning';
      case 'Out of Service':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <ShipIcon className="h-5 w-5 mr-2 text-primary-500" />
          Ships Management
        </h2>
        
        {canCreateShip && (
          <Button
            onClick={() => {
              setEditingShip(null);
              setShowAddShipForm(true);
            }}
            variant="primary"
            startIcon={<Plus className="h-4 w-4" />}
          >
            Add New Ship
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search ships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div className="relative w-full md:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Out of Service">Out of Service</option>
          </select>
        </div>
      </div>

      {/* Add/Edit Ship Form */}
      {showAddShipForm && (
        <Card>
          <ShipForm 
            ship={editingShip} 
            onCancel={() => {
              setShowAddShipForm(false);
              setEditingShip(null);
            }} 
          />
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : sortedShips.length === 0 ? (
        <div className="bg-white rounded-lg shadow-card p-8 text-center">
          <ShipIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No ships found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter 
              ? "No ships match your current filters. Try adjusting your search criteria." 
              : "There are no ships in the system yet. Add a new ship to get started."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-card">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left font-medium">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-1"
                  >
                    <span>Name</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="py-3 px-4 text-left font-medium">
                  <button
                    onClick={() => handleSort('imo')}
                    className="flex items-center space-x-1"
                  >
                    <span>IMO Number</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="py-3 px-4 text-left font-medium">
                  <button
                    onClick={() => handleSort('flag')}
                    className="flex items-center space-x-1"
                  >
                    <span>Flag</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="py-3 px-4 text-left font-medium">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center space-x-1"
                  >
                    <span>Status</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="py-3 px-4 text-left font-medium">Last Updated</th>
                <th className="py-3 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedShips.map((ship) => (
                <tr 
                  key={ship.id} 
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <Link 
                      to={`/ships/${ship.id}`}
                      className="font-medium text-primary-600 hover:text-primary-800"
                    >
                      {ship.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4">{ship.imo}</td>
                  <td className="py-3 px-4">{ship.flag}</td>
                  <td className="py-3 px-4">
                    <Badge variant={getStatusVariant(ship.status)}>
                      {ship.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {formatDate(ship.updatedAt)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/ships/${ship.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label="View ship"
                        >
                          <ShipIcon className="h-4 w-4 text-gray-500" />
                        </Button>
                      </Link>
                      
                      {canUpdateShip && (
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label="Edit ship"
                          onClick={() => {
                            setEditingShip(ship);
                            setShowAddShipForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
                      )}
                      
                      {canDeleteShip && (
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label="Delete ship"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this ship?')) {
                              removeShip(ship.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShipList;