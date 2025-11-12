import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Search, 
  Filter,
  Package,
  Calendar,
  MapPin,
  QrCode
} from 'lucide-react';
import { formatDate, getServiceStatus, getStatusColor } from '../utils/helpers';

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = [
    'Electronics',
    'Machinery',
    'Tools',
    'Vehicles',
    'IT Equipment',
    'Medical',
    'Laboratory',
    'Other'
  ];

  const statuses = ['Active', 'Inactive', 'Under Maintenance', 'Retired'];

  useEffect(() => {
    fetchEquipment();
  }, []);

  useEffect(() => {
    filterEquipment();
  }, [equipment, searchTerm, statusFilter, categoryFilter]);

  const fetchEquipment = async () => {
    try {
      const { data } = await api.get('/equipment');
      setEquipment(data);
    } catch (error) {
      toast.error('Failed to load equipment');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterEquipment = () => {
    let filtered = [...equipment];

    if (searchTerm) {
      filtered = filtered.filter(
        (eq) =>
          eq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          eq.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          eq.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((eq) => eq.status === statusFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter((eq) => eq.category === categoryFilter);
    }

    setFilteredEquipment(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Equipment</h1>
            <p className="mt-2 text-gray-600">
              Manage and track all your equipment
            </p>
          </div>
          <Link
            to="/equipment/new"
            className="mt-4 sm:mt-0 btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Equipment</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Equipment Grid */}
        {filteredEquipment.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((item) => {
              const serviceStatus = getServiceStatus(item.serviceExpiryDate);
              const statusColor = getStatusColor(item.status);
              
              return (
                <Link
                  key={item._id}
                  to={`/equipment/${item._id}`}
                  className="card hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{item.model}</p>
                    </div>
                    <QrCode className="h-6 w-6 text-gray-400 group-hover:text-primary-500 transition-colors" />
                  </div>

                  <div className="space-y-2 mb-4">
                    {item.serialNumber && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Package className="h-4 w-4 mr-2" />
                        <span>SN: {item.serialNumber}</span>
                      </div>
                    )}
                    {item.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{item.location}</span>
                      </div>
                    )}
                    {item.serviceExpiryDate && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Service: {formatDate(item.serviceExpiryDate)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className={`badge badge-${statusColor === 'green' ? 'success' : statusColor === 'yellow' ? 'warning' : statusColor === 'red' ? 'danger' : 'gray'}`}>
                      {item.status}
                    </span>
                    {item.serviceExpiryDate && (
                      <span className={`badge badge-${serviceStatus.color === 'green' ? 'success' : serviceStatus.color === 'yellow' ? 'warning' : serviceStatus.color === 'red' ? 'danger' : 'info'}`}>
                        {serviceStatus.label}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No equipment found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter || categoryFilter
                ? 'Try adjusting your filters'
                : 'Get started by adding your first equipment'}
            </p>
            {!searchTerm && !statusFilter && !categoryFilter && (
              <Link to="/equipment/new" className="btn-primary inline-flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Add Equipment</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentList;
